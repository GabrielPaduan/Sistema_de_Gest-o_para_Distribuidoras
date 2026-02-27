import { Box, Button, Checkbox, MenuItem, Modal, Select, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs, TextField, Typography } from "@mui/material"
import { SearchField } from "./searchField"
import { useEffect, useState } from "react"
import { createClient, getAllClients, searchClientsByName } from "../services/clientService"
import { ClientDTO, ClientDTOInsert, ContractDTO, ContractDTOInsert, ProductDTO, ProductsCategoriesDTO } from "../utils/DTOS"
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce"
import { TableContract } from "./TableContract"
import { getAllProducts, searchProductsByName } from "../services/productService"
import { GenericButton } from "./GenericButton"
import { getAllCategories } from "../services/categoriasProdutoService"
import { generateReport } from "../utils/Report"

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

export const FormVendas: React.FC = () => {
    const [clientsData, setClientsData] = useState<ClientDTO[]>([]);
    const [productsClient, setProductsClient] = useState<ProductDTO[]>([]);
    const [contracts, setContracts] = useState<ContractDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermProducts, setSearchTermProducts] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [contractsInsert, setContractsInsert] = useState<ContractDTOInsert>();
    const [newClientData, setNewClientData] = useState<ClientDTO>({
        id: 0,
        cli_email: "",
        cli_doc: "",
        cli_typeDoc: 0,
        cli_end: "",
        cli_cep: "",
        cli_dddTel: "",
        cli_telefone: "",
        cli_dddCel: "",
        cli_cidade: "",
        cli_celular: "",
        cli_endNum: "",
        cli_bairro: "",
        cli_uf: "",
        cli_insEstadual: "",   
        cli_responsavel: "",
        cli_ClienteAtivo: false, 
        cli_razaoSocial: ""
    });
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number>(0);
    const [productCategories, setProductCategories] = useState<ProductsCategoriesDTO[]>([]);
    const [cmdt, setCmdt] = useState(1);
    const [porcLucro, setPorcLucro] = useState(0);
    const [displayClientSearch, setDisplayClientSearch] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [debouncedSearchTermProducts] = useDebounce(searchTermProducts, 500);
    const navigate = useNavigate();
    const [vendasType, setVendasType] = useState(0);
    const [newClientState, setNewClientState] = useState(false);
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [contractToEdit, setContractToEdit] = useState<number>(0);

    const handleOpenAddProductModal = () => {
        setOpenAddProductModal(true);
    }

    const handleClose = () => {
        setOpenAddProductModal(false);
    }

     const handleOpenEdit = (contractId: number, productId: number) => {
        setSelectedProduct(productId);
        setContractToEdit(contractId);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setContractToEdit(0);
        setSelectedProduct(0);
        setCmdt(1);
        setOpenEdit(false);
    };

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
                const productsData = await getAllProducts();
                setProducts(productsData || []);
                const categoriesData = await getAllCategories();
                setProductCategories(categoriesData || []);
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

    const handleSearch = async (query: string, type: number) => {
        setPage(0); 
        if (!query) {
            switch (type) {
                case 0:
                    const data = await getAllClients();
                    setClientsData(Array.isArray(data) ? data : []);
                    break;
                case 1: 
                    const productsData = await getAllProducts();
                    setProducts(productsData || []);
                    break;
            }
        }
        try {
            switch (type) {
                case 0:
                    const response = await searchClientsByName(query);
                    setClientsData(response || []);
                    break;
                case 1:
                    const responseProducts = await searchProductsByName(query);
                    setProducts(responseProducts || []);
                    break;
                }
        } catch (error) {
            switch (type) {
                case 0:            
                    setClientsData([]);
                    break;
                case 1:
                    setProducts([]);
                    break;
            }
        }
    }

    const handleChangeNewClientState = () => {
        if (!newClientState) {
            handleInsertClient();
            setNewClientState(true);
        } else {
            const client = selectedClient ? selectedClient : newClientData;
            generateReport(client, contracts, productsClient, [], productCategories);
            setNewClientState(false);
        }
    }

    const handleInsertContract = async (client: ClientDTO, productId: number, cmdt: number, porcLucro: number) => {
        const newContract: ContractDTOInsert = {
            Cont_ID_Cli: client?.id || 0,
            Cont_ID_Prod: productId,
            Cont_Comodato: cmdt,
            Cont_Qtde: 0,
            Cont_ValorTotal: 0.00,
            Cont_PorcLucro: porcLucro
        };

        const contractExists = contracts.find(c => c.Cont_ID_Prod === productId);

        if (!contractExists) {
            setContracts(prev => [...prev, newContract as ContractDTO]);

            const fullProductData = products.find(p => p.ID_Prod === productId);
            if (fullProductData) {
                setProductsClient(prev => {
                    if (!prev.find(p => p.ID_Prod === productId)) {
                        return [...prev, fullProductData];
                    }
                    return prev;
                });
            }

        } else {
            setContracts(currentContracts =>
                currentContracts.map(c => {
                    if (c.Cont_ID_Prod === productId) {
                        return { ...c, Cont_Comodato: cmdt, Cont_PorcLucro: porcLucro };
                    }
                    return c;
                })
            );
        }
        handleClose();
        setSelectedProduct(0); 
        setCmdt(1);
        setPorcLucro(0);
    };

    const handleUpdateComodato = async (productId: number, newComodato: number, newPorcLucro: number) => {
        const contractToUpdate = contracts.find(c => c.Cont_ID_Prod === productId);
    
        if (contractToUpdate) {
            try {
                setContracts(currentContracts =>
                    currentContracts.map(c => 
                        c.ID_Contrato === contractToUpdate.ID_Contrato ? { ...c, Cont_Comodato: newComodato, Cont_PorcLucro: newPorcLucro } : c
                    )
                );
                handleCloseEdit();
            } catch (err) {
                console.error("Erro ao atualizar o comodato:", err);
            }
        }
    };


    const handleInsertClient = async () => {
        try {
            const newClientDataInsert: ClientDTOInsert = {
                cli_razaoSocial: newClientData.cli_razaoSocial,
                cli_doc: newClientData.cli_doc,
                cli_typeDoc: newClientData.cli_typeDoc,
                cli_end: newClientData.cli_end,
                cli_cep: newClientData.cli_cep,
                cli_email: newClientData.cli_email,
                cli_bairro: newClientData.cli_bairro,
                cli_uf: newClientData.cli_uf,
                cli_insEstadual: newClientData.cli_insEstadual,
                cli_dddTel: newClientData.cli_dddTel,
                cli_telefone: newClientData.cli_telefone,
                cli_dddCel: newClientData.cli_dddCel,
                cli_cidade: newClientData.cli_cidade,
                cli_celular: newClientData.cli_celular,
                cli_endNum: newClientData.cli_endNum,
                cli_responsavel: newClientData.cli_responsavel,
                cli_ClienteAtivo: newClientData.cli_ClienteAtivo,
            };

        } catch (error) {
            console.error("Erro ao criar cliente:", error);
        }
    }

     const handleAddProduct = (contractId: number, cmdt: number) => {
        setContracts(currentContracts =>
            currentContracts.map(c => {
                const product = productsClient.find(p => p.ID_Prod === c.Cont_ID_Prod);
                let totalValue = 0;

                if (c.Cont_PorcLucro > 0) {
                    totalValue = product ? product.Prod_CustoCompra + (product.Prod_CustoCompra * (c.Cont_PorcLucro / 100)) : 0;
                } else {
                    totalValue = product ? product.Prod_CustoCompra + (product.Prod_CustoCompra * (product.Prod_PorcLucro / 100)) : 0;
                }
                
                if (
                    c.ID_Contrato === contractId &&
                    product?.Prod_Estoque !== undefined &&
                    c.Cont_Qtde < product.Prod_Estoque
                ) {
                    const newQuantity = c.Cont_Qtde + 1;
                    return { ...c, Cont_Qtde: newQuantity, Cont_ValorTotal: newQuantity * totalValue };
                }
                return c;
            })
        );
    };

    const handleRemoveProduct = (contractId: number) => {
        setContracts(currentContracts =>
            currentContracts.map(c => {
                const product = productsClient.find(p => p.ID_Prod === c.Cont_ID_Prod);
                let totalValue = 0;
                if (c.Cont_PorcLucro > 0) {
                    totalValue = product ? product.Prod_CustoCompra + (product.Prod_CustoCompra * (c.Cont_PorcLucro / 100)) : 0;
                } else {
                    totalValue = product ? product.Prod_CustoCompra + (product.Prod_CustoCompra * (product.Prod_PorcLucro / 100)) : 0;
                }
                if (c.ID_Contrato === contractId && c.Cont_Qtde > 0 && product?.Prod_Valor !== undefined) {
                    const newQuantity = c.Cont_Qtde - 1;
                    return { ...c, Cont_Qtde: newQuantity, Cont_ValorTotal: newQuantity * totalValue };
                }
                return c;
            })
        );
    };

    const onRemoveContract = (contractId: number) => {
        setContracts(currentContracts => currentContracts.filter(c => c.ID_Contrato !== contractId));
        const contract = contracts.find(c => c.ID_Contrato === contractId);
        if (contract) {
            const productId = contract.Cont_ID_Prod;
            setProductsClient(currentProducts => currentProducts.filter(p => p.ID_Prod !== productId));
        }
    };

    useEffect(() => {
        handleSearch(debouncedSearchTerm, 0);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        handleSearch(debouncedSearchTermProducts, 1);
    }, [debouncedSearchTermProducts])

    return (
        <Box width={"100%"} margin={"auto"}>
            <Modal
                open={openAddProductModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={{ ...style, '@media (max-width: 800px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Adicionar Novo Produto
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                    <SearchField onSearchChange={setSearchTermProducts} />
                    <Box sx={{ maxHeight: "20vh", overflowY: "scroll", marginTop: 2 }}>
                        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                            <Box key={product.ID_Prod} sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, borderBottom: '1px solid #ccc', cursor: 'pointer' }} onClick={() => setSelectedProduct(product.ID_Prod)}>
                                <Checkbox
                                    checked={product.ID_Prod === selectedProduct}
                                    onChange={(e) => {
                                        setSelectedProduct(e.target.checked ? product.ID_Prod : 0)
                                        setPorcLucro(product.Prod_PorcLucro);
                                    }}
                                    sx={{ width: '9%', color: 'grey' }}
                                    color="secondary"
                                />
                                <Typography width={"90%"} alignSelf={"center"}>{product.Prod_CodProduto} || R${product.Prod_Valor} || {product.Prod_Categoria >= 0 ? productCategories.find(cat => cat.ID_CategoriaProduto === product.Prod_Categoria)?.CatProd_Nome : 'erro'}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <TablePagination
                        component="div"
                        count={products.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[3, 5, 7]}
                    />
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} mt={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column" } }}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"} width={"60%"} height={"100%"} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                            <Typography component="label" htmlFor={`quantity`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                Comodato:
                            </Typography>
                            <TextField
                                id={`quantity`}
                                name={`quantity`}
                                variant="outlined"
                                value={cmdt}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setCmdt(isNaN(value) ? 1 : value);
                                }}
                                inputProps = {{ style: { padding: "8px" } }}
                            />
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}  height={"100%"} gap={2}>
                                <Typography component="label" htmlFor={`quantity`} variant="h6">
                                    % de lucro:
                                </Typography>
                                <TextField
                                    id={`quantity`}
                                    name={`quantity`}
                                    variant="outlined"
                                    value={porcLucro}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setPorcLucro(isNaN(value) ? 0 : value);
                                    }}
                                    inputProps = {{ style: { padding: "8px" } }}
                                />
                            </Box>
                        <Box width={"40%"} display={"flex"} justifyContent={"center"} height={"100%"} gap={1} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleInsertContract(newClientData, selectedProduct, cmdt, porcLucro)}
                            >
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}> Adicionar</Typography>
                            </Button>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Voltar</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                            Editar Produto
                        </Typography>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} mt={2}>
                            <Typography id="modal-modal-description" variant="h6">Produto Selecionado: {productsClient.find(p => p.ID_Prod === selectedProduct)?.Prod_CodProduto}</Typography>
                            <Typography id="modal-modal-description" variant="h6">Comodato atual: {contracts.find(c => c.ID_Contrato === contractToEdit)?.Cont_Comodato}</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} flexDirection={"column"} gap={2} mt={2}>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} flexDirection={"column"}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}  height={"100%"} gap={2}>
                                    <Typography component="label" htmlFor={`quantity`} variant="h6">
                                        Comodato:
                                    </Typography>
                                    <TextField
                                        id={`quantity`}
                                        name={`quantity`}
                                        variant="outlined"
                                        value={cmdt}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setCmdt(isNaN(value) ? 1 : value);
                                        }}
                                        inputProps = {{ style: { padding: "8px" } }}
                                    />
                                </Box>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}  height={"100%"} gap={2}>
                                    <Typography component="label" htmlFor={`quantity`} variant="h6">
                                        % de lucro:
                                    </Typography>
                                    <TextField
                                        id={`quantity`}
                                        name={`quantity`}
                                        variant="outlined"
                                        value={porcLucro}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setPorcLucro(isNaN(value) ? 0.1 : value);
                                        }}
                                        inputProps = {{ style: { padding: "8px" } }}
                                    />
                                </Box>
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} height={"100%"} gap={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdateComodato(selectedProduct, cmdt, porcLucro)}
                                >
                                    <Typography variant="h6" fontSize={16}> Editar</Typography>
                                </Button>
                                <Button onClick={handleCloseEdit} variant="contained" color="primary">
                                    <Typography variant="h6" fontSize={16}>Voltar</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2}>
                <Box width={"70%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2}>   
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Tabs value={vendasType} onChange={handleChangeVendasType} aria-label="basic tabs example">
                            <Tab label="Novo Cliente" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                            <Tab label="Cliente Existente" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                        </Tabs>
                    </Box>
                    {vendasType === 1 && (
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2} width={"100%"}>
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
                            <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ width: "100%" }}>
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
                               <TableContract
                                    client={selectedClient}
                                    contracts={contracts}
                                    products={productsClient}
                                    selectedItems={[]}
                                    onToggleSelect={() => {}}
                                    onAddProduct={handleAddProduct}
                                    onRemoveProduct={handleRemoveProduct}
                                    onRemoveContract={onRemoveContract}
                                    openEditContract={(contractId, productId) => handleOpenEdit(contractId, productId)}
                                    productCategories={productCategories}
                                />
                                <Box sx={{width: "100%", '@media (max-width: 800px)': { width: '100%' } }}  display={"flex"} justifyContent={"center"} gap={2}>
                                    <Button variant="contained" color="primary" sx={{ width: "100%", padding: "15px", '@media (max-width: 800px)': { padding: "15px" } }} onClick={handleOpenAddProductModal}>
                                        <Typography variant="h6" fontSize={'14px'} sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }}>Adicionar Produto</Typography>
                                    </Button>
                                    <Button onClick={() => handleChangeNewClientState()}  variant="contained" color="primary" sx={{ width: "100%", padding: "15px", '@media (max-width: 800px)': { padding: "15px" } }}>
                                        <Typography variant="h6" fontSize={14}>Concluir Venda</Typography>
                                    </Button>
                                    <GenericButton name="Voltar" type="button" onClick={() => navigate("/pagina-inicial")} />
                                </Box>  
                            </Box>
                        </Box>
                    )}
                    {vendasType === 0 && ( 
                        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={2} sx={{ width: "100%" }}>
                            {!newClientState && (
                                <Box component={"form"} display={"flex"} gap={2} flexDirection={"column"} sx={{ width: "70%" }}>
                                    <TextField label="Razão Social" variant="outlined" onChange={(e) => setNewClientData({...newClientData, cli_razaoSocial: e.target.value})} value={newClientData ? newClientData.cli_razaoSocial : ''} fullWidth placeholder="Digite a razão social" sx={{ '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' } }}/>
                                    <Box width={"100%"} display={"flex"} gap={2}>
                                        <Select
                                            labelId="doc-select-label"
                                            id="doc-select"
                                            defaultValue={0}
                                            name="cli_typeDoc"
                                            value={newClientData ? newClientData.cli_typeDoc : 0}
                                            onChange={(e) => setNewClientData({...newClientData, cli_typeDoc: e.target.value})}
                                            fullWidth
                                        >
                                            <MenuItem value={0}>CPF</MenuItem>
                                            <MenuItem value={1}>CNPJ</MenuItem>
                                        </Select>
                                        <TextField label="Documento" variant="outlined" sx={{ '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' } }} onChange={(e) => setNewClientData({...newClientData, cli_doc: e.target.value})} value={newClientData ? newClientData.cli_doc : ""} fullWidth placeholder="Digite o número do documento" />
                                    </Box>
                                    <Box width={"100%"} display={"flex"} justifyContent={"center"} gap={2}>
                                        <GenericButton name="Próximo" type="button" onClick={() => handleChangeNewClientState()} />
                                        <GenericButton name="Voltar" type="button" onClick={() => navigate("/pagina-inicial")} />
                                    </Box>
                                </Box>
                            )}
                            {newClientState && (
                                <Box width={"90%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={2}>
                                    <Typography variant="h6" fontSize={16} color="text.primary">Adicione os produtos para {newClientData.cli_razaoSocial}</Typography>
                                       <TableContract
                                        client={newClientData}
                                        contracts={contracts}
                                        products={productsClient}
                                        selectedItems={[]}
                                        onToggleSelect={() => {}}
                                        onAddProduct={handleAddProduct}    
                                        onRemoveProduct={handleRemoveProduct}
                                        onRemoveContract={onRemoveContract}
                                        openEditContract={(contractId, productId) => handleOpenEdit(contractId, productId)}
                                        productCategories={productCategories}
                                    />
                                    <Box sx={{width: "100%", '@media (max-width: 800px)': { width: '100%' } }}  display={"flex"} justifyContent={"center"} gap={2}>
                                        <Button variant="contained" color="primary" sx={{ width: "100%", padding: "15px", '@media (max-width: 800px)': { padding: "15px" } }} onClick={handleOpenAddProductModal}>
                                            <Typography variant="h6" fontSize={'14px'} sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }}>Adicionar Produto</Typography>
                                        </Button>
                                        <Button variant="contained" color="primary" sx={{ width: "100%", padding: "15px", '@media (max-width: 800px)': { padding: "15px" } }} onClick={() => setNewClientState(false)}>
                                            <Typography variant="h6" fontSize={'14px'} sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }}>Editar Cliente</Typography>
                                        </Button>
                                        <Button onClick={() => handleChangeNewClientState()}  variant="contained" color="primary" sx={{ width: "100%", padding: "15px", '@media (max-width: 800px)': { padding: "15px" } }}>
                                            <Typography variant="h6" fontSize={14}>Concluir Venda</Typography>
                                        </Button>
                                        <GenericButton name="Voltar" type="button" onClick={() => navigate("/pagina-inicial")} />
                                    </Box>  
                                </Box>    
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}