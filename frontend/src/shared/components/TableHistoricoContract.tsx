import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SearchField } from "./searchField";
import { ClientDTO, PdfStructCompleteDTO, PdfStructDTO, ProductDTO, SnapshotProductDTO, SnapshotProductDTOInsert } from "../utils/DTOS";
import { getPdfByStatus, updatePdf, getPdfById } from "../services/pdfContract";
import { getClientById, getClientByPDF } from "../services/clientService";
import { getContractByClientId, updateContract } from "../services/contractService";
import { getProductById, updateProduct } from "../services/productService";
import { PreviewReport } from "./PreviewReport";
import { GenericButton } from "./GenericButton";
import { generateReport } from "../utils/Report";
import { useNavigate } from "react-router-dom";
import { ClientRow } from "./ClientRow";
import { create } from "domain";
import { createSnapshotProduct, getSnapshotProductsByPdfId } from "../services/SnapshotProductsService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export const TableHistoricoContract: React.FC = () => {
    const [pdfsData, setPdfsData] = React.useState<PdfStructDTO[]>([]);
    const [pdfsCompleteData, setPdfsCompleteData] = React.useState<PdfStructCompleteDTO[]>([]);
    const [clientsData, setClientsData] = React.useState<ClientDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [selectedPdf, setSelectedPdf] = useState<PdfStructCompleteDTO | null>(null);
    const [valueTab, setValueTab] = React.useState(0);
    const [openRow, setOpenRow] = React.useState<number | null>(null);
    const [snapshotProducts, setSnapshotProducts] = React.useState<SnapshotProductDTO[]>([]);
    const navigate = useNavigate();
    

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        if (showReport) {
            setShowReport(false);
        }
        setValueTab(newValue);
    };

    const handleShowReport = async (pdf: PdfStructCompleteDTO) => {
        if (pdf.PDF_Status === 0) {
            
            if (pdf.PDF_Contracts.length === 0) {
                const contractData = await getContractByClientId(pdf.PDF_Client?.id || 0);
                pdf.PDF_Contracts = Array.isArray(contractData) ? contractData : [contractData];
            }
            if (pdf.PDF_Products.length === 0) {
                const productData: ProductDTO[] = await Promise.all(
                    pdf.PDF_Contracts.map(async contract => await getProductById(contract.Cont_ID_Prod))
                );  
                pdf.PDF_Products = productData;
            }
        } else {
            const snapshotsData: SnapshotProductDTO[] = await getSnapshotProductsByPdfId(pdf.id);
            setSnapshotProducts(snapshotsData);
        }
        setSelectedPdf(pdf);
        setShowReport(true);
    };

    const handleCloseReport = () => {
        setShowReport(false);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchPDFContracts = async () => {
            try {
                const dataPdfs = await getPdfByStatus(0);
                setPdfsData(dataPdfs);

                const pdfsComplete: PdfStructCompleteDTO[] = await Promise.all(
                    dataPdfs.map(async pdf => {
                        const dataClient = await getClientById(pdf.PDF_Client_Id);
                        return {
                            id: pdf.id,
                            PDF_Status: pdf.PDF_Status,
                            PDF_Generated_Date: pdf.PDF_Generated_Date,
                            PDF_Client: dataClient,
                            PDF_Contracts: [],
                            PDF_Products: [],
                            PDF_Observacoes: pdf.PDF_Observacoes
                        };
                    })
                );
                setPdfsCompleteData(pdfsComplete);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPDFContracts();
        
        const fetchClientsWithPDFs = async () => {
            try {
                const clients = await getClientByPDF();
                const filterClients = Array.isArray(clients) ? clients : [clients];
                setClientsData(filterClients);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClientsWithPDFs();
    }, []);

    async function handleConfirmPdf(): Promise<void> {
        if (!selectedPdf) {
            return; 
        }
        const pdfToUpdate: PdfStructDTO = {
            id: selectedPdf.id,
            PDF_Client_Id: selectedPdf.PDF_Client ? selectedPdf.PDF_Client.id : 0,
            PDF_Status: 1,
            PDF_Generated_Date: selectedPdf.PDF_Generated_Date,
            PDF_Observacoes: "", 
        };

        try {
            await updatePdf(pdfToUpdate.id, pdfToUpdate);
            
            const selectedCompletePDF = pdfsCompleteData.find(pdf => pdf.id === selectedPdf.id);
            
            if (selectedCompletePDF && selectedCompletePDF.PDF_Client) {
            
                generateReport(selectedCompletePDF.PDF_Client, selectedCompletePDF.PDF_Contracts, selectedCompletePDF.PDF_Products, snapshotProducts);
                selectedCompletePDF.PDF_Status = 1;

                const contractData = await getContractByClientId(selectedCompletePDF.PDF_Client.id);
                
            
                const contractsArray = Array.isArray(contractData) ? contractData : [contractData];

                contractsArray.forEach(async contract => {
                    const product = selectedCompletePDF.PDF_Products.find(prod => prod.ID_Prod === contract.Cont_ID_Prod);
                    const snapshotProduct: SnapshotProductDTOInsert = { 
                        ContPDFItens_PDF_ID: selectedCompletePDF.id,
                        snapshot_qtde: contract.Cont_Qtde,
                        snapshot_comodato: contract.Cont_Comodato,
                        snapshot_prod_nome: product ? product.Prod_Nome : "",
                        snapshot_prod_cod: product ? product.Prod_CodProduto : "",
                        snapshot_valor_unitario: contract.Cont_Qtde > 0 ? parseFloat((contract.Cont_ValorTotal / contract.Cont_Qtde).toFixed(2)) : 0,
                        snapshot_valor_total_item: parseFloat(contract.Cont_ValorTotal),
                    }
                    await createSnapshotProduct(snapshotProduct);
                });

                const productData: ProductDTO[] = await Promise.all(
                    contractsArray.map(async contract => await getProductById(contract.Cont_ID_Prod))
                );

                const productArray = Array.isArray(productData) ? productData : [productData];

                contractsArray.forEach(async contract => {
                    const product = productArray.find(prod => prod.ID_Prod === contract.Cont_ID_Prod);
                    if (!product) return;
                    product.Prod_Estoque = product.Prod_Estoque - contract.Cont_Qtde;
                    await updateProduct(product);
                });


                for (const contract of contractsArray) {
                    contract.Cont_Qtde = 0;
                    contract.Cont_ValorTotal = 0;
            
                    await updateContract(
                        contract.ID_Contrato, 
                        contract.Cont_Comodato, 
                        contract.Cont_Qtde, 
                        contract.Cont_ValorTotal, 
                        contract.Cont_PorcLucro
                    );
                }
            }

        } catch (error) {
            console.error("Erro ao confirmar o PDF ou atualizar contratos:", error);
        } finally {
            handleCloseReport();
        }
    }

    const filteredClientsPDF = 
     pdfsCompleteData.filter(pdfComplete =>
        pdfComplete.PDF_Client?.cli_razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
    ); 
    
    const filteredClients = clientsData.filter(client =>
        client.cli_razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: "70%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, '@media (max-width:800px)': { width: '95%' } }}>
            <Box width={'100%'}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-evenly' }}>
                        <Tabs value={valueTab} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab label="Pendentes" {...a11yProps(0)} sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                            <Tab label="Clientes" {...a11yProps(1)} sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                        </Tabs>
                </Box>
                
                <CustomTabPanel value={valueTab} index={0}>
                      {
                    !showReport && (
                        <Box sx={{ width: "100%" }}>
                            <SearchField onSearchChange={setSearchTerm} />
                            <TableContainer component={Paper} sx={{margin: "auto", cursor: "default", overflowY: "scroll", maxHeight: "57vh", marginTop: 3, marginBottom: 3 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell  sx={{ fontSize: 20, textAlign: "center" }}>Nome</TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Data</TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Endereço</TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center" }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filteredClientsPDF.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 20 }}>
                                                    Nenhum pdf de contrato cadastrado
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredClientsPDF.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pdf) => (
                                                <TableRow
                                                    id={String(pdf.id)}
                                                    key={pdf.id}
                                                    hover
                                                    style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                                >
                                                    <TableCell sx={{ fontSize: 16, textAlign: "center" }}>{pdf.PDF_Client?.cli_razaoSocial}</TableCell>
                                                    <TableCell sx={{ fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>{pdf.PDF_Generated_Date ? new Date(pdf.PDF_Generated_Date).toLocaleDateString('pt-BR', {timeZone: "UTC"}) : ""}</TableCell>
                                                    <TableCell sx={{ fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>{pdf.PDF_Client?.cli_end === "" ? "Não informado" : pdf.PDF_Client?.cli_end}</TableCell>
                                                    <TableCell sx={{ fontSize: 16, textAlign: "center" }}>{ pdf.PDF_Status == 0 ? <Button variant="contained" color="primary" onClick={() => handleShowReport(pdf)}>Visualizar</Button> : "Relatório Aprovado"}</TableCell>
                                                </TableRow>
                                            ))
                                        )
                                    }
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={filteredClientsPDF.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 15]}
                                />
                            </TableContainer>
                            <GenericButton name="Voltar" type="button" link="/gerenciar-clientes" />
                        </Box>
                    )}
                    {selectedPdf && selectedPdf?.PDF_Client && showReport && (
                        <Box width={"100%"}>
                            <PreviewReport client={selectedPdf?.PDF_Client} contracts={selectedPdf?.PDF_Contracts} products={selectedPdf?.PDF_Products} />
                            
                            <Box>
                                <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>Observações:</Typography>
                                <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, fontSize: 20, borderRadius: '4px', padding: '10px', width: '80%', margin: 'auto' }}>
                                    {selectedPdf.PDF_Observacoes ? selectedPdf.PDF_Observacoes : "Nenhuma observação adicionada."}
                                </Typography>
                            </Box>
                            
                            <Box display={"flex"} justifyContent={"center"} gap={2} sx={{ textAlign: 'center', my: 4, '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleConfirmPdf}
                                >
                                    <Typography variant="h6">Gerar Contrato</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(`/contrato-cliente/${selectedPdf.PDF_Client?.id}`)}
                                >
                                    <Typography variant="h6">Editar</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ padding: "15px" }}
                                    onClick={() => handleCloseReport()}
                                >
                                    <Typography variant="h6">Ocultar Relatório</Typography>
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CustomTabPanel>
                <CustomTabPanel value={valueTab} index={1}>
                    {!showReport && (
                        <Box sx={{ width: "100%" }}>
                            <SearchField onSearchChange={setSearchTerm} />
                            <TableContainer component={Paper} sx={{margin: "auto", cursor: "default", overflowY: "scroll", maxHeight: "57vh", marginTop: 3, marginBottom: 3 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: 20, textAlign: "Center"}}/>
                                        <TableCell  sx={{ fontSize: 20, textAlign: "center" }}>Nome</TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Endereço</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filteredClients.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 20 }}>
                                                    Nenhum cliente cadastrado
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                                                <ClientRow
                                                    key={client.id}
                                                    client={client}
                                                    handleViewPdf={async (pdf: PdfStructDTO) => {
                                                        const dataClientSingle = await getClientById(pdf.PDF_Client_Id);
                                                        const pdfComplete: PdfStructCompleteDTO = {
                                                            id: pdf.id,
                                                            PDF_Status: pdf.id,
                                                            PDF_Generated_Date: pdf.PDF_Generated_Date,
                                                            PDF_Client: dataClientSingle,
                                                            PDF_Contracts: [],
                                                            PDF_Products: [],
                                                            PDF_Observacoes: pdf.PDF_Observacoes
                                                        };
                             
                                                        if (pdfComplete) {
                                                            
                                                            handleShowReport(pdfComplete);
                                                        }
                                                    }}
                                                />
                                            ))
                                            
                                        )
                                    }
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={filteredClients.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 15]}
                                />
                            </TableContainer>
                            <GenericButton name="Voltar" type="button" link="/gerenciar-clientes" />
                        </Box>
                    )}
                    {(selectedPdf || snapshotProducts.length > 0) && selectedPdf?.PDF_Client && showReport && (
                        <Box width={"100%"}>
                            <PreviewReport client={selectedPdf?.PDF_Client} contracts={selectedPdf?.PDF_Contracts} products={selectedPdf?.PDF_Products} snapshotProducts={snapshotProducts} />
                            
                            <Box>
                                <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>Observações:</Typography>
                                <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, fontSize: 20, borderRadius: '4px', padding: '10px', width: '80%', margin: 'auto' }}>
                                    {selectedPdf.PDF_Observacoes ? selectedPdf.PDF_Observacoes : "Nenhuma observação adicionada."}
                                </Typography>
                            </Box>
                            
                            <Box display={"flex"} justifyContent={"center"} gap={2} sx={{ textAlign: 'center', my: 4, '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={ selectedPdf.PDF_Status === 0 ? handleConfirmPdf : () => generateReport(selectedPdf.PDF_Client!, selectedPdf.PDF_Contracts, selectedPdf.PDF_Products, snapshotProducts)}
                                >
                                    <Typography variant="h6">Gerar Contrato</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(`/contrato-cliente/${selectedPdf.PDF_Client?.id}`)}
                                    sx={{ display: selectedPdf.PDF_Status === 0 ? "block" : "none" }}
                                >
                                    <Typography variant="h6">Editar</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ padding: "15px" }}
                                    onClick={() => handleCloseReport()}
                                >
                                    <Typography variant="h6">Ocultar Relatório</Typography>
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CustomTabPanel>
            </Box>
          
        </Box>
    )
}
