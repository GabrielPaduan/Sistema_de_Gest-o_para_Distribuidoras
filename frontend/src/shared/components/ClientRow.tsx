import React, { useEffect } from "react";
import { ClientDTO, PdfStructDTO } from "../utils/DTOS";
import { getPdfByClientId } from "../services/pdfContract";
import { Box, Button, CircularProgress, Collapse, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface ClientRowProps {
    client: ClientDTO;
    handleViewPdf: (pdf: PdfStructDTO) => void;
    handleDeletePDF: (pdfId: number) => void;
    handleOpenPaymentModal: () => void;
}

export const ClientRow: React.FC<ClientRowProps> = ({ client, handleViewPdf, handleDeletePDF, handleOpenPaymentModal }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [pdfContracts, setPdfContracts] = React.useState<PdfStructDTO[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [saldoDevedor, setSaldoDevedor] = React.useState<number>(0);

    useEffect(() => {
        if (isOpen && pdfContracts.length === 0) {
            const fetchPdfContracts = async () => {
                setLoading(true);
                try {
                    const data: PdfStructDTO | null = await getPdfByClientId(client.id);
                    setPdfContracts(prevContracts => [...prevContracts, ...(Array.isArray(data) ? data : [])]);
                } catch (error) {
                    console.error("Error fetching PDF contracts:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPdfContracts();
        } 
    }, [client.id, isOpen]);

    useEffect(() => {
        const calcularSaldoDevedor = () => {
            const totalValor = pdfContracts.reduce((acc, pdf) => acc + (pdf.PDF_Valor || 0), 0);
            const totalValorPago = pdfContracts.reduce((acc, pdf) => acc + (pdf.PDF_ValorPago || 0), 0);
            setSaldoDevedor(totalValor - totalValorPago < 0 ? 0 : totalValor - totalValorPago);
        }
        calcularSaldoDevedor();
    }, [pdfContracts]);

    const handleDeletePDFInList = (pdfId: number) => {
        setPdfContracts(prevContracts => prevContracts.filter(pdf => pdf.id !== pdfId));
        handleDeletePDF(pdfId);
    }

    return (
        <React.Fragment>
            <TableRow hover style={{ cursor: "pointer", backgroundColor: isOpen ? "#f0f0f0" : "inherit" }} onClick={() => setIsOpen(!isOpen)}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" >
                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontSize: 16, textAlign: "center" }}>{client.cli_razaoSocial}</TableCell>
                <TableCell sx={{ fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>{client.cli_end === "" ? "Não informado" : client.cli_end}</TableCell>
                <TableCell sx={{ fontSize: 16, textAlign: "center" }}>R$ {saldoDevedor.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, padding: 2, backgroundColor: "#f9f9f9" }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Contratos PDF
                            </Typography>
                            {loading && (
                                <Box sx={{ textAlign: "center", padding: 2 }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            {!loading && pdfContracts.length === 0 && (
                                <Typography variant="body1">Nenhum contrato PDF encontrado para este cliente.</Typography>
                            )}

                            {!loading && pdfContracts.length > 0 && (
                                <Table size="small" aria-label="pdf-contracts">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{width: "33%", fontSize: 16, textAlign: "center" }}>DATA</TableCell> 
                                            <TableCell sx={{ width: "33%", fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>STATUS</TableCell>
                                            <TableCell sx={{width: "33%", fontSize: 16, textAlign: "center" }} colSpan={2}>Financeiro</TableCell> 
                                            <TableCell sx={{ width: "33%", fontSize: 16, textAlign: "center" }} colSpan={3}>AÇÕES</TableCell>
                                        </TableRow> 
                                    </TableHead>
                                    <TableBody>
                                        {pdfContracts.sort((a, b) => {return new Date(b.PDF_Generated_Date).getTime() - new Date(a.PDF_Generated_Date).getTime()}).map((pdf) => (
                                            <TableRow key={pdf.id}>
                                                <TableCell sx={{ width: "33%", fontSize: 16, textAlign: "center" }}>{pdf.PDF_Generated_Date ? new Date(pdf.PDF_Generated_Date).toLocaleDateString('pt-BR', {timeZone: "UTC"}) : ""}</TableCell>
                                                <TableCell sx={{ width: "33%", fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>{pdf.PDF_Status === 0 ? "Não Gerado" : pdf.PDF_Status === 1 ? "Aguardando Pagamento" : "Concluído"}</TableCell>
                                                <TableCell sx={{ width: "33%", fontSize: 16, textAlign: "center" }} colSpan={2}>
                                                    <Box display={"flex"} justifyContent={"center"} width={"100%"} gap={2}> 
                                                        <Typography variant="h6" fontSize={16}>TOTAL: R$ {pdf.PDF_Valor?.toFixed(2) || "0.00"}</Typography>
                                                        <Typography variant="h6" fontSize={16}>PAGO: R$ {pdf.PDF_ValorPago?.toFixed(2) || "0.00"}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{width: "100%", fontSize: 16, textAlign: "center" }}>
                                                    <Box display={"flex"} justifyContent={"center"} width={"100%"} gap={2}>
                                                        <Button variant="contained" color="primary" onClick={(e) => {
                                                            e.stopPropagation(); 
                                                            handleViewPdf(pdf); 
                                                        }}>
                                                            <Typography variant="h6" fontSize={14}>Visualizar</Typography>
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ display: pdf.PDF_Status === 1 ? "block" : "none" }}
                                                            onClick={() => handleOpenPaymentModal()}
                                                        >
                                                            <Typography variant="h6" fontSize={14}>Pagamento</Typography>
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => handleDeletePDFInList(pdf.id)}><Typography variant="h6" fontSize={14}>Excluir</Typography></Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}