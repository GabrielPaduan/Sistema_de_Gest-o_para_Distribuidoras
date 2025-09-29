import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Icon } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search";
import { ClientDTO } from "../utils/DTOS";
import React, { useEffect, useState } from "react";
import { getAllClients, removeClient } from "../services/clientService";
import { SearchField } from "./searchField";

export const TableClients: React.FC = () => {
    const [clientsData, setClientsData] = React.useState<ClientDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const[page, setPage] = useState(0);
    const[rowsPerPage, setRowsPerPage] = useState(5);
    
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect (() => {
        const fetchClients = async () => {
        try {
            const data = await getAllClients();
            setClientsData(data);
        } catch (err: any) {
            console.error(err);
        } 
        };

        fetchClients();
    }, []);

    const filteredClients = clientsData.filter(client =>
        client.cli_razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function onRemoveContract(id: number): Promise<void> {
        filteredClients.splice(filteredClients.findIndex(client => client.id === id), 1);
        setClientsData([...filteredClients]);
        await removeClient(id);
    }

    return (
        <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, marginBottom: 2, '@media (max-width: 600px)': { maxWidth: "90%" } }}>
            <SearchField onSearchChange={setSearchTerm} />
            <TableContainer component={Paper} sx={{margin: "auto", cursor: "default", overflowY: "scroll", maxHeight: "57vh", marginTop: 3 }}>
                <Table stickyHeader>
                    <TableHead >
                        <TableRow sx={{ background: '#00008B' }}>
                            <TableCell  sx={{ fontSize: 20, textAlign: "center" }}>Cliente</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { display: 'none' } }}>E-mail</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { display: 'none' } }}>Endereço</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>REMOVER</TableCell>
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
                                    <TableRow
                                        id={String(client.id)}
                                        key={client.id}
                                        hover
                                        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                        
                                    >
                                        <TableCell onClick={() => window.location.href = `/contrato-cliente/${client.id}`} sx={{ fontSize: 16, textAlign: "center" }}>{client.cli_razaoSocial}</TableCell>
                                        <TableCell onClick={() => window.location.href = `/contrato-cliente/${client.id}`} sx={{ fontSize: 16, textAlign: "center", '@media (max-width: 600px)': { display: 'none' } }}>{client.cli_email === "" ? "Não informado" : client.cli_email}</TableCell>
                                        <TableCell onClick={() => window.location.href = `/contrato-cliente/${client.id}`} sx={{ fontSize: 16, textAlign: "center", '@media (max-width: 600px)': { display: 'none' } }}>{client.cli_end === "" ? "Não informado" : client.cli_end}</TableCell>
                                        <TableCell  sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { padding: "0px" } }}>
                                            <Button onClick={() => onRemoveContract(client.id)} sx={{ '@media (max-width: 600px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 600px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                        </TableCell>
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
                    sx={{ '@media (max-width: 600px)': { 
                        '& .MuiTablePagination-selectLabel': {
                            display: 'none'
                        }
                    }}}
                />
            </TableContainer>
        </Box>
    )
}