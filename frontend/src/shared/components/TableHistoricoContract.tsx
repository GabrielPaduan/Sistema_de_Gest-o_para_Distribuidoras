import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SearchField } from "./searchField";
import { ClientDTO, PdfStructCompleteDTO, PdfStructDTO, ProductDTO } from "../utils/DTOS";
import { getAllPDFContracts, updatePdf } from "../services/pdfContract";
import { getClientById } from "../services/clientService";
import { getContractByClientId } from "../services/contractService";
import { getProductById } from "../services/productService";
import { PreviewReport } from "./PreviewReport";
import { GenericButton } from "./GenericButton";
import { generateReport } from "../utils/Report";
import { useNavigate } from "react-router-dom";

export const TableHistoricoContract: React.FC = () => {
    const [pdfsData, setPdfsData] = React.useState<PdfStructDTO[]>([]);
    const [pdfsCompleteData, setPdfsCompleteData] = React.useState<PdfStructCompleteDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [selectedPdf, setSelectedPdf] = useState<PdfStructCompleteDTO | null>(null);
    const navigate = useNavigate();

    const handleShowReport = (pdf: PdfStructCompleteDTO) => {
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
                const dataPdfs = await getAllPDFContracts();
                setPdfsData(dataPdfs);

                const pdfsComplete: PdfStructCompleteDTO[] = await Promise.all(
                    dataPdfs.map(async pdf => {
                        const dataClient = await getClientById(pdf.PDF_Client_Id);
                        const contractData = await getContractByClientId(pdf.PDF_Client_Id);
                        const contractsArray = Array.isArray(contractData) ? contractData : [contractData];
                        const productData: ProductDTO[] = await Promise.all(
                            contractsArray.map(async contract => await getProductById(contract.Cont_ID_Prod))
                        );
                        return {
                            id: pdf.id,
                            PDF_Status: pdf.PDF_Status,
                            PDF_Generated_Date: pdf.PDF_Generated_Date,
                            PDF_Client: dataClient,
                            PDF_Contracts: contractsArray,
                            PDF_Products: productData,
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
    }, []);

    function handleConfirmPdf(): void {
        if (selectedPdf) {           
            selectedPdf.PDF_Status = 1; // Atualiza o status para confirmado
            const selectedPDF: PdfStructDTO = { id: selectedPdf.id, PDF_Client_Id: selectedPdf.PDF_Client ? selectedPdf.PDF_Client.id : 0, PDF_Status: selectedPdf.PDF_Status, PDF_Generated_Date: selectedPdf.PDF_Generated_Date, PDF_Observacoes: selectedPdf.PDF_Observacoes };
            const fetchUpdatePdf = async () => {
                try {
                    await updatePdf(selectedPDF.id, selectedPDF);
                    console.log("PDF atualizado com sucesso:", selectedPDF);
                } catch (error) {
                    console.error("Erro ao atualizar PDF:", error);
                }
            };
            fetchUpdatePdf();
            
            const selectedCompletePDF = pdfsCompleteData.find(pdf => pdf.id === selectedPdf.id);
            if (selectedCompletePDF && selectedCompletePDF.PDF_Client) {
                generateReport(selectedCompletePDF.PDF_Client, selectedCompletePDF.PDF_Contracts, selectedCompletePDF.PDF_Products);
            }

            handleCloseReport();
        }
    }

    const filteredClients = pdfsCompleteData.filter(pdfComplete =>
        pdfComplete.PDF_Client?.cli_razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: "70%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, '@media (max-width:800px)': { width: '95%' } }}>
            {!showReport && (
                <Box sx={{ width: "100%" }}>
                    <SearchField onSearchChange={setSearchTerm} />
                    <TableContainer component={Paper} sx={{margin: "auto", cursor: "default", overflowY: "scroll", maxHeight: "57vh", marginTop: 3, marginBottom: 3 }}>
                        <Table stickyHeader>
                            <TableHead>
                            <TableRow>
                                <TableCell  sx={{ fontSize: 20, textAlign: "center" }}>Nome</TableCell>
                                <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Data</TableCell>
                                <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>Status</TableCell>
                                <TableCell sx={{ fontSize: 20, textAlign: "center" }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 20 }}>
                                            Nenhum pdf de contrato cadastrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pdf) => (
                                        <TableRow
                                            id={String(pdf.id)}
                                            key={pdf.id}
                                            hover
                                            style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                        >
                                            <TableCell sx={{ fontSize: 16, textAlign: "center" }}>{pdf.PDF_Client?.cli_razaoSocial}</TableCell>
                                            <TableCell sx={{ fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>{pdf.PDF_Client?.cli_email === "" ? "Não informado" : pdf.PDF_Client?.cli_email}</TableCell>
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
                            count={filteredClients.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 15]}
                        />
                    </TableContainer>
                    <GenericButton name="Voltar" type="button" link="/pagina-inicial" />
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
                    
                    <Box display={"flex"} justifyContent={"center"} gap={2} sx={{ textAlign: 'center', my: 4, '@media (max-width: 600px)': { flexDirection: "column", gap: 2 } }}>
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
        </Box>
    )
}
