import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Icon, Modal, Typography } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search";
import { ClientDTO } from "../utils/DTOS";
import React, { useEffect, useState } from "react";
import { getAllClients, removeClient, updateClientStatus } from "../services/clientService";
import { SearchField } from "./searchField";
import { useNavigate } from "react-router-dom";
import { ProtectedComponent } from "./ProtectedComponent";

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

export const TableClientsWithContract: React.FC = () => {
    const [clientsData, setClientsData] = React.useState<ClientDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const[page, setPage] = useState(0);
    const[rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const [openSwitchClientStatus, setOpenSwitchClientStatus] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<number>(0);

    const handleOpenSwitchClientStatus = (id: number) => {
        setSelectedClientId(id);
        setOpenSwitchClientStatus(true);
    }

    const handleClose = () => {
        setOpenSwitchClientStatus(false);
    }

    const handleSwitchClientStatus = async (id: number) => {
        await updateClientStatus(id);
        setClientsData(clientsData.map(client => {
            if (client.id === id) {
                return { ...client, cli_ClienteAtivo: !client.cli_ClienteAtivo };
            }
            return client;
        }));
        handleClose();
    }
    
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

    const handleNavigateToContract = (id: number, isClientActive: boolean) => {
        if (isClientActive === false) {
            handleOpenSwitchClientStatus(id);
            return;
        }
        navigate(`/contrato-cliente/${id}`);
    }

    return (
        <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, marginBottom: 2, '@media (max-width: 800px)': { maxWidth: "90%" } }}>
            <Modal
                open={openSwitchClientStatus}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, '@media (max-width: 800px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Deseja alterar o status deste cliente para ativo?
                    </Typography>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} marginTop={3}>
                        <Button variant="contained" color="primary" onClick={() => handleSwitchClientStatus(selectedClientId)}>Sim</Button>
                        <Button variant="contained" color="primary" onClick={() => handleClose()}>Não</Button>
                    </Box>
                </Box>
            </Modal>
            <SearchField onSearchChange={setSearchTerm} />
            <TableContainer component={Paper} sx={{margin: "auto", cursor: "default", overflowY: "scroll", maxHeight: "45vh", marginTop: 3 }}>
                <Table stickyHeader>
                    <TableHead >
                        <TableRow sx={{ background: '#00008B' }}>
                            <TableCell  sx={{ fontSize: 14, textAlign: "center" }}>Cliente</TableCell>
                            <ProtectedComponent allowedRoles={['1']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Editar</TableCell>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Remover</TableCell>
                            </ProtectedComponent>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredClients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 14 }}>
                                        Nenhum cliente cadastrado
                                    </TableCell>
                                </TableRow>
                            )
                        } 
                        {
                            filteredClients.length > 70 && (
                                filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                                    <TableRow
                                        id={String(client.id)}
                                        key={client.id}
                                        hover
                                        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                        onClick={() => handleNavigateToContract(client.id, client.cli_ClienteAtivo)}
                                    >
                                        <TableCell  sx={{ fontSize: 12, textAlign: "center" }} onClick={() => handleNavigateToContract(client.id, client.cli_ClienteAtivo)}>{client.cli_razaoSocial}</TableCell>
                                        <ProtectedComponent allowedRoles={['1']}>
                                            <TableCell sx={{ fontSize: 14, textAlign: "center", padding: "10px" }}>
                                                <Button onClick={() => navigate(`/editar-cliente/${client.id}`)}><Icon sx={{ fontSize: 30 }}>edit</Icon></Button>
                                            </TableCell>
                                            <TableCell  sx={{ fontSize: 14, textAlign: "center", padding: "10px", '@media (max-width: 800px)': { padding: "0px" } }}>
                                                <Button onClick={() => onRemoveContract(client.id)} sx={{ '@media (max-width: 800px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                            </TableCell>
                                        </ProtectedComponent>
                                    </TableRow>
                                ))
                            )
                        } 
                        {
                            filteredClients.length <= 70 && (
                                filteredClients.map((client) => (
                                    <TableRow
                                        id={String(client.id)}
                                        key={client.id}
                                        hover
                                        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                    >
                                        <TableCell sx={{ fontSize: 12, textAlign: "center" }} onClick={() => handleNavigateToContract(client.id, client.cli_ClienteAtivo)}>{client.cli_razaoSocial}</TableCell>
                                        <ProtectedComponent allowedRoles={['1']}>
                                            <TableCell sx={{ fontSize: 14, textAlign: "center", padding: "10px" }}>
                                                <Button onClick={() => navigate(`/editar-cliente/${client.id}`)}><Icon sx={{ fontSize: 30 }}>edit</Icon></Button>
                                            </TableCell>
                                            <TableCell  sx={{ fontSize: 14, textAlign: "center", padding: "10px", '@media (max-width: 800px)': { padding: "0px" } }}>
                                                <Button onClick={() => onRemoveContract(client.id)} sx={{ '@media (max-width: 800px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                            </TableCell>
                                        </ProtectedComponent>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
                { filteredClients.length > 70 &&
                    <TablePagination
                        component="div"
                        count={filteredClients.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15]}
                        sx={{ '@media (max-width: 800px)': { 
                            '& .MuiTablePagination-selectLabel': {
                                display: 'none'
                            }
                        }}}
                    />
                }
            </TableContainer>
        </Box>
    )
}