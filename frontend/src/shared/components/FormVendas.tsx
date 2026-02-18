import { Box, Button, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, TextField, Typography } from "@mui/material"
import { SearchField } from "./searchField"
import { useEffect, useState } from "react"
import { getAllClients } from "../services/clientService"
import { ClientDTO } from "../utils/DTOS"
import { useNavigate } from "react-router-dom";

export const FormVendas: React.FC = () => {
    const [clientsData, setClientsData] = useState<ClientDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [displayClientSearch, setDisplayClientSearch] = useState<'flex' | 'none'>('flex');
    const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
    const navigate = useNavigate();

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getAllClients();
                setClientsData(data);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        }
        fetchClients();
    }, [])

    const handleFillClient = (client: ClientDTO) => {
        setSelectedClient(client);
        setDisplayClientSearch('none');
    }

    return (
        <Box width={"70%"} margin={"auto"}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2}>
                <Box width={"100%"}>
                    <SearchField onSearchChange={setSearchTerm} />
                    <Box width={"100%"} display={displayClientSearch} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} >
                        {clientsData.length > 0 && searchTerm.length > 0 &&
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {clientsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                                            <TableRow key={client.id} hover sx={{ cursor: "pointer" }} onClick={() => { handleFillClient(client) }}>
                                                <TableCell sx={{ padding: "5px"}}><Typography textAlign="left" fontSize={14} fontFamily={'Arial'}>{client.cli_razaoSocial}</Typography></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={clientsData.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[3, 5, 7]}
                                    sx={{'& .MuiTablePagination-selectLabel': { fontSize: 12 }, '& .MuiSelect-select': { fontSize: 12 }, '& .MuiTablePagination-displayedRows': { fontSize: 12 }, '& .MuiTablePaginationActions-root': { fontSize: 12 }, '@media (max-width: 800px)': { 
                                        '& .MuiTablePagination-selectLabel': {
                                            display: 'none'
                                        }
                                    }}}
                                />
                            </TableContainer>
                        }
                    </Box>
                </Box>
                <Box display={"flex"} gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, width: "100%" }}>
                    <TextField label="Cliente" value={selectedClient ? selectedClient.cli_razaoSocial : ''} InputProps={{ readOnly: true }} fullWidth />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, width: "100%" }}>
                    
                </Box>
                
            </Box>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2} mt={2} sx={{ flexDirection: "row"  }}>
                <Button onClick={() => {}} variant="contained" color="primary" sx={{ width: "100%" }}>
                    <Typography variant="h6" fontSize={14}>Confirmar Lançamento</Typography>
                </Button>
                <Button onClick={() => navigate("/pagina-inicial")} variant="contained" color="primary" sx={{ width: "100%" }}>
                    <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Voltar</Typography>
                </Button>
            </Box>
        </Box>
    )
}