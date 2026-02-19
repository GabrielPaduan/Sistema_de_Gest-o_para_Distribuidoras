import { Box, Button, MenuItem, Select, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs, TextField, Typography } from "@mui/material"
import { SearchField } from "./searchField"
import { useEffect, useState } from "react"
import { getAllClients, searchClientsByName } from "../services/clientService"
import { ClientDTO } from "../utils/DTOS"
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce"
import { set } from "date-fns"
import { TableContract } from "./TableContract"

export const FormVendas: React.FC = () => {
    const [clientsData, setClientsData] = useState<ClientDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [displayClientSearch, setDisplayClientSearch] = useState(false);
    
    const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const navigate = useNavigate();

    const [vendasType, setVendasType] = useState(0);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeVendasType = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            setVendasType(0);
            setSelectedClient(null);
        } else {
            setVendasType(1);
        }  
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getAllClients();
                setClientsData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        }
        fetchClients();
    }, [])

    const handleFillClient = (client: ClientDTO) => {
        setSelectedClient(client);
        setDisplayClientSearch(false);
    }

    const handleSearch = async (query: string) => {
        setPage(0);
        if (!query) {
            const data = await getAllClients();
            setClientsData(Array.isArray(data) ? data : []);
            return;
        }
        try {
            const response = await searchClientsByName(query);
           
            setClientsData(response || []);
            
        } catch (error) {
            setClientsData([]);
        }
    }

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <Box width={"70%"} margin={"auto"}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2}>
                <Box width={"100%"}>   
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Tabs value={vendasType} onChange={handleChangeVendasType} aria-label="basic tabs example">
                            <Tab label="Novo Cliente" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                            <Tab label="Cliente Existente" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                        </Tabs>
                    </Box>
                    {vendasType === 1 && (
                        <>
                        <SearchField onSearchChange={(value: string) => {
                            setSearchTerm(value);
                            setDisplayClientSearch(value.trim().length > 0);
                        }} />
                        
                        {displayClientSearch && (
                            <Box width={"100%"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2}>
                                {clientsData.length > 0 ? (
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                {clientsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                                                    <TableRow key={client.id} hover sx={{ cursor: "pointer" }} onClick={() => { handleFillClient(client) }}>
                                                        <TableCell sx={{ padding: "5px"}}>
                                                            <Typography textAlign="left" fontSize={14} fontFamily={'Arial'}>
                                                                {client.cli_razaoSocial}
                                                            </Typography>
                                                        </TableCell>
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
                                            sx={{
                                                '& .MuiTablePagination-selectLabel': { fontSize: 12 }, 
                                                '& .MuiSelect-select': { fontSize: 12 }, 
                                                '& .MuiTablePagination-displayedRows': { fontSize: 12 }, 
                                                '& .MuiTablePaginationActions-root': { fontSize: 12 }, 
                                                '@media (max-width: 800px)': { 
                                                    '& .MuiTablePagination-selectLabel': { display: 'none' }
                                                }
                                            }}
                                        />
                                    </TableContainer>
                                ) : (
                                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={2}>
                                        <Typography variant="h6" fontSize={14} color="text.secondary">Nenhum cliente encontrado</Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                        </>
                    )}
                </Box>
                
                <Box display={"flex"} gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, width: "100%" }}>
                    <Box display={"flex"} gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, width: "100%" }}>
                        <TextField label="Cliente Selecionado" value={selectedClient ? selectedClient.cli_razaoSocial : ''} InputProps={{ readOnly: true }} fullWidth />
                        <Box width={"20%"} marginLeft={2}>
                            <Select
                                labelId="doc-select-label"
                                id="doc-select"
                                label="doc"
                                name="cli_typeDoc"
                                value={selectedClient?.cli_typeDoc || 0}
                                fullWidth
                            >
                                <MenuItem value={0}>CPF</MenuItem>
                                <MenuItem value={1}>CNPJ</MenuItem>
                            </Select>
                        </Box>
                        <TextField label="Documento" value={selectedClient ? selectedClient.cli_doc : ''} InputProps={{ readOnly: true }} fullWidth />
                    </Box>
                </Box>
                
            </Box>
            {/* <TableContract
                client={}
                contracts={}
                products={}
                selectedItems={}
                onToggleSelect={}
                onAddProduct={}    
                onRemoveProduct={}
                onRemoveContract={}
                openEditContract={}
                productCategories={}
            /> */}
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2} mt={2} sx={{ flexDirection: "row" }}>
                <Button onClick={() => {}} variant="contained" color="primary" sx={{ width: "100%" }}>
                    <Typography variant="h6" fontSize={14}>Cadastrar</Typography>
                </Button>
                <Button onClick={() => navigate("/pagina-inicial")} variant="contained" color="primary" sx={{ width: "100%" }}>
                    <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Voltar</Typography>
                </Button>
            </Box>
        </Box>
    )
}