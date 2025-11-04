import React, { useEffect } from "react";
import { ClientDTO, PdfStructDTO } from "../utils/DTOS";
import { getPdfByClientId } from "../services/pdfContract";
import { Box, Button, CircularProgress, Collapse, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Padding } from "@mui/icons-material";

interface ClientRowProps {
    client: ClientDTO;
    handleViewPdf: (pdf: PdfStructDTO) => void;
}

export const ClientRow: React.FC<ClientRowProps> = ({ client, handleViewPdf }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [pdfContracts, setPdfContracts] = React.useState<PdfStructDTO[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

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
     
    }, [client.id, isOpen, pdfContracts.length]);

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
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
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
                                            <TableCell sx={{ fontSize: 16, textAlign: "center" }}>DATA</TableCell> 
                                            <TableCell sx={{ fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>STATUS</TableCell>
                                            <TableCell sx={{ fontSize: 16, textAlign: "center" }}>AÇÕES</TableCell>
                                        </TableRow> 
                                    </TableHead>
                                    <TableBody>
                                        {pdfContracts.map((pdf) => (
                                            <TableRow key={pdf.id}>
                                                <TableCell sx={{ fontSize: 16, textAlign: "center" }}>{pdf.PDF_Generated_Date ? new Date(pdf.PDF_Generated_Date).toLocaleDateString('pt-BR') : ""}</TableCell>
                                                <TableCell sx={{ fontSize: 16, textAlign: "center", '@media (max-width:600px)': { display: 'none' } }}>{pdf.PDF_Status}</TableCell>
                                                <TableCell sx={{ fontSize: 16, textAlign: "center" }}>
                                                    <Button variant="contained" color="primary" onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        handleViewPdf(pdf); 
                                                    }}>Visualizar</Button>
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