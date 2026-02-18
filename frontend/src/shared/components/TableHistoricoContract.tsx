import { Box, Button, InputAdornment, Modal, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SearchField } from "./searchField";
import { ClientDTO, PdfStructCompleteDTO, PdfStructDTO, ProductDTO, ProductsCategoriesDTO, SnapshotProductDTO, SnapshotProductDTOInsert } from "../utils/DTOS";
import { getPdfByStatus, updatePdf, getPdfById, deletePdfContract } from "../services/pdfContract";
import { getClientById, getClientByPDF } from "../services/clientService";
import { getContractByClientId, removeContract, updateContract } from "../services/contractService";
import { getProductById, updateProduct } from "../services/productService";
import { PreviewReport } from "./PreviewReport";
import { GenericButton } from "./GenericButton";
import { generateReport } from "../utils/Report";
import { useNavigate } from "react-router-dom";
import { ClientRow } from "./ClientRow";
import { create } from "domain";
import { createSnapshotProduct, deleteSnapshotProduct, getSnapshotProductsByPdfId } from "../services/SnapshotProductsService";
import { getAllCategories } from "../services/categoriasProdutoService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
    const [productCategories, setProductsCategories] = useState<ProductsCategoriesDTO[]>([]);
    const navigate = useNavigate();
    const [modalPaymentOpen, setModalPaymentOpen] = useState(false);
    const [valorPago, setValorPago] = useState(0);

    const handleOpenPaymentModal = () => {
        setModalPaymentOpen(true);
    };

    const handleClosePaymentModal = () => {
        setModalPaymentOpen(false);
        setValorPago(0);
    };
    

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

    const handleDeletePDF = async (pdf_id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este PDF? Esta ação não pode ser desfeita.")) {
        try {
            await deletePdfContract(pdf_id);
            const updatedPdfs = pdfsCompleteData.filter(p => p.id !== pdf_id);
            setPdfsCompleteData(updatedPdfs);
        } catch (err) {
            console.error(err);
        }
    }
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

    const handlePayment = async (paymentType: number) => {
        const updatedPdf = {
            id: selectedPdf?.id || 0,
            PDF_Client_Id: selectedPdf?.PDF_Client?.id || 0,
            PDF_Status: selectedPdf?.PDF_Status || 0,
            PDF_Generated_Date: selectedPdf?.PDF_Generated_Date || new Date().toISOString(),
            PDF_Observacoes: selectedPdf?.PDF_Observacoes || "",
            PDF_Valor: selectedPdf?.PDF_Valor || 0,
            PDF_ValorPago: paymentType === 1 ? selectedPdf?.PDF_Valor || 0 : valorPago
        };
        try {
            await updatePdf(selectedPdf?.id || 0, updatedPdf);
            const updatedPdfs = pdfsCompleteData.map(pdf => {
                if (pdf.id === selectedPdf?.id) {
                    return {
                        ...pdf,
                        PDF_ValorPago: paymentType === 1 ? selectedPdf?.PDF_Valor || 0 : valorPago
                    };
                }
                return pdf;
            });
            setPdfsCompleteData(updatedPdfs);
        } catch (err) {
            console.error(err);
        }

        handleClosePaymentModal();
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
                            PDF_Observacoes: pdf.PDF_Observacoes,
                            PDF_Valor: pdf.PDF_Valor,
                            PDF_ValorPago: pdf.PDF_ValorPago
                        };
                    })
                );
                setPdfsCompleteData(pdfsComplete);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPDFContracts();

        const fetchProductsCategories = async () => {
             const productCategories = await getAllCategories();
            setProductsCategories(productCategories);
        }
        
        fetchProductsCategories();

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
            PDF_Valor: selectedPdf.PDF_Valor,
            PDF_ValorPago: selectedPdf.PDF_ValorPago
        };

        try {
            await updatePdf(pdfToUpdate.id, pdfToUpdate);
            
            const selectedCompletePDF = pdfsCompleteData.find(pdf => pdf.id === selectedPdf.id);
            
            if (selectedCompletePDF && selectedCompletePDF.PDF_Client) {
            
                generateReport(selectedCompletePDF.PDF_Client, selectedCompletePDF.PDF_Contracts, selectedCompletePDF.PDF_Products, snapshotProducts, productCategories);
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
                        snapshot_prod_cat: product ? product.Prod_Categoria : 0
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
            handleCloseReport();
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
             <Modal
                open={modalPaymentOpen}
                onClose={handleClosePaymentModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...style, textAlign: "center"}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Lançar Pagamento
                    </Typography>
                    <Box display={"flex"} flexDirection={"column"} gap={2} marginTop={2}>
                        <Typography variant="h6">Valor Total do Contrato: R${selectedPdf?.PDF_Valor.toFixed(2)}</Typography>
                        <Typography variant="h6">Valor Pago: R${selectedPdf?.PDF_ValorPago.toFixed(2)}</Typography>
                        <Box display={"flex"} justifyContent={"center"} gap={2}>
                            <TextField
                                label="Valor Pago"
                                variant="outlined"
                                placeholder="Digite o valor pago"
                                value={valorPago}
                                onChange={(e) => setValorPago(Number(e.target.value))}
                                sx={{ width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }}
                                slotProps={{
                                    input: {
                                    startAdornment: <InputAdornment position="start"><Typography sx={{ color: 'gray' }}>R$</Typography></InputAdornment>,
                                    },
                                }}
                                type="number"
                            />
                            <Button 
                                variant="contained"
                                color="primary"
                                sx={{ width: "100%" }}
                                onClick={() => handlePayment(0)}
                            >
                                <Typography variant="h6" fontSize={14}>Confirmar</Typography>
                            </Button>
                        </Box>
                    </Box>
                    <Box display={"flex"} gap={2} justifyContent={"space-between"} width={"100%"} marginTop={2}>
                            <Button 
                                variant="contained"
                                color="primary"
                                sx={{ width: "100%" }}
                                onClick={() => handlePayment(1)}
                            >
                                <Typography variant="h6" fontSize={14}>Deixar como Pago</Typography>
                            </Button>
                            <Button 
                                variant="contained"
                                color="primary"
                                sx={{ width: "100%" }}
                                onClick={handleClosePaymentModal}
                            >
                                <Typography variant="h6" fontSize={14}>Fechar</Typography>
                            </Button>

                    </Box>
                </Box>
            </Modal>
            
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
                                        <TableCell  sx={{ fontSize: 14, textAlign: "center" }}>Nome</TableCell>
                                        <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Data</TableCell>
                                        <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Endereço</TableCell>
                                        <TableCell sx={{ fontSize: 14, textAlign: "center" }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filteredClientsPDF.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 14 }}>
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
                            <PreviewReport client={selectedPdf?.PDF_Client} contracts={selectedPdf?.PDF_Contracts} products={selectedPdf?.PDF_Products} productCategories={productCategories} />
                            <Box>
                                <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>Observações:</Typography>
                                <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, fontSize: 14, borderRadius: '4px', padding: '10px', width: '80%', margin: 'auto' }}>
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
                                        <TableCell sx={{ fontSize: 14, textAlign: "Center"}}/>
                                        <TableCell  sx={{ fontSize: 14, textAlign: "center" }}>Nome</TableCell>
                                        <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Endereço</TableCell>
                                        <TableCell sx={{ fontSize: 14, textAlign: "center" }}>Saldo Devedor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filteredClients.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 14 }}>
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
                                                            PDF_Status: pdf.PDF_Status,
                                                            PDF_Generated_Date: pdf.PDF_Generated_Date,
                                                            PDF_Client: dataClientSingle,
                                                            PDF_Contracts: [],
                                                            PDF_Products: [],
                                                            PDF_Observacoes: pdf.PDF_Observacoes,
                                                            PDF_Valor: pdf.PDF_Valor,
                                                            PDF_ValorPago: pdf.PDF_ValorPago
                                                        };
                             
                                                        if (pdfComplete) {
                                                            handleShowReport(pdfComplete);
                                                        }
                                                    }}
                                                    handleDeletePDF={handleDeletePDF}
                                                    handleOpenPaymentModal={handleOpenPaymentModal}
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
                            <PreviewReport client={selectedPdf?.PDF_Client} contracts={selectedPdf?.PDF_Contracts} products={selectedPdf?.PDF_Products} productCategories={productCategories} snapshotProducts={snapshotProducts}  />
                            
                            <Box>
                                <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>Observações:</Typography>
                                <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, fontSize: 14, borderRadius: '4px', padding: '10px', width: '80%', margin: 'auto' }}>
                                    {selectedPdf.PDF_Observacoes ? selectedPdf.PDF_Observacoes : "Nenhuma observação adicionada."}
                                </Typography>
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} gap={2} sx={{ textAlign: 'center', my: 4, '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                                <Button
                                    variant="contained"
                                    onClick={ selectedPdf.PDF_Status === 0 ? handleConfirmPdf : () => generateReport(selectedPdf.PDF_Client!, selectedPdf.PDF_Contracts, selectedPdf.PDF_Products, snapshotProducts, productCategories)}
                                >
                                    <Typography variant="h6" fontSize={14}>Gerar Contrato</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/contrato-cliente/${selectedPdf.PDF_Client?.id}`)}
                                    sx={{ display: selectedPdf.PDF_Status === 0 ? "block" : "none" }}
                                >
                                    <Typography variant="h6" fontSize={14}>Editar</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ display: selectedPdf.PDF_Status === 1 ? "block" : "none" }}
                                    onClick={() => handleOpenPaymentModal()}
                                >
                                    <Typography variant="h6" fontSize={14}>Pagamento</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ padding: "15px" }}
                                    onClick={() => handleCloseReport()}
                                >
                                    <Typography variant="h6" fontSize={14}>Ocultar Relatório</Typography>
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CustomTabPanel>
            </Box>
          
        </Box>
    )
}
