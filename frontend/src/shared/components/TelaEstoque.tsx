import { Box, Button, Icon, InputAdornment, MenuItem, Modal, Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { TableProducts } from "./TableProducts";
import { ProtectedComponent } from "./ProtectedComponent";
import { GenericButton } from "./GenericButton";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../services/categoriasProdutoService";
import { ProductDTO, ProductLaunch, ProductLaunching, ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from "../utils/DTOS";
import { SearchField } from "./searchField";
import { useDebounce } from "use-debounce";
import { getAllProducts, getProductById, launchProduct, searchProductsByName } from "../services/productService";
import { createLaunch } from "../services/productLaunchService";
import { useAuth } from '../context/AuthContext';

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

export const TelaEstoque: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openLancamentos, setOpenLancamentos] = useState(false);
    const [categorias, setCategorias] = useState<ProductsCategoriesDTO[]>([]);
    const [nomeCategoria, setNomeCategoria] = useState<string>('');
    const [prateleira, setPrateleira] = useState<number>(0);
    const [categoriaToEdit, setCategoriaToEdit] = useState<ProductsCategoriesDTO | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageLaunch, setPageLaunch] = useState(0);
    const [rowsPerPageLaunch, setRowsPerPageLaunch] = useState(3);
    const [modalMode, setModalMode] = useState<0 | 1>(0); 
    const [filterCategory, setFilterCategory] = useState<number>(-1);
    const [lancType, setLancType] = useState<0 | 1>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [productsData, setProductsData] = useState<ProductDTO[]>([]);
    const [displayProductSearch, setDisplayProductSearch] = useState<'flex' | 'none'>('flex');
    const [selectedProductLaunch, setSelectedProductLaunch] = useState<ProductLaunching>({ ID_Prod: 0, Prod_CodProduto: "", Prod_Estoque: 0, Prod_CustoCompra: 0, Prod_Observacao: "", Prod_QuantidadeLancada: 0 });
    const [ProductLaunch, setProductLaunch] = useState<ProductLaunch>();
    const { user } = useAuth()

    const ITEM_HEIGHT = 48; 
    const ITEM_PADDING_TOP = 8; 
    const MenuProps = {
        PaperProps: {
            style: {
            maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP, 
            width: 250, 
            },
        },
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePageLaunch = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPageLaunch(newPage);
    }

    const handleChangeRowsPerPageLaunch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPageLaunch(parseInt(event.target.value, 10));
        setPageLaunch(0);
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllCategories();
            const products = await getAllProducts();
            setProductsData(products);
            setCategorias(data);
        }
        fetchData();
            
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalMode(0);
        setCategoriaToEdit({ ID_CategoriaProduto: 0, CatProd_Nome: "", Cat_Prateleira: 0 });
        setNomeCategoria('');
        setPrateleira(0)
    }   
    
    const handleOpenLancamentos = () => setOpenLancamentos(true);
    const handleCloseLancamentos = () => {
        setOpenLancamentos(false);
    }

    const handleChangeLancType = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            setLancType(0);
        } else {
            setLancType(1);
        }  
    };

    const handleSwitchModalMode = (category: ProductsCategoriesDTO) => {
        if (categoriaToEdit?.ID_CategoriaProduto === category.ID_CategoriaProduto) {
            setModalMode(0);
            setCategoriaToEdit(null);
            return;
        }
        setModalMode(1);
        setCategoriaToEdit(category);
    }

    const handleInsertCategory = async (nomeCategoria: ProductsCategoriesDTOInsert) => {
        await createCategory(nomeCategoria);
        const data = await getAllCategories();
        setCategorias(data);
        setNomeCategoria('');
        setPrateleira(0);
    }

    const handleEditCategory = async (categoriaToEdit: ProductsCategoriesDTO) => {
        await updateCategory(categoriaToEdit.ID_CategoriaProduto, { CatProd_Nome: categoriaToEdit.CatProd_Nome, Cat_Prateleira: categoriaToEdit.Cat_Prateleira });
        const data = await getAllCategories();
        setCategorias(data);
        setModalMode(0);
        setPrateleira(0);
        setCategoriaToEdit(null); 
    }

    const handleDeleteCategory = async (categoryID: number) => {   
        await deleteCategory(categoryID);
        const data = await getAllCategories();
        setCategorias(data);
    }

    const handleFillProductLaunchData = (product: ProductDTO) => {
        setSelectedProductLaunch({
            ID_Prod: product.ID_Prod,
            Prod_CodProduto: product.Prod_CodProduto,
            Prod_Estoque: product.Prod_Estoque,
            Prod_CustoCompra: 0,
            Prod_Observacao: '',
            Prod_QuantidadeLancada: 0,
        });
        setDisplayProductSearch('none');
    }

    const handleSearch = async (query: string) => {
        setPageLaunch(0);
        if (!query) {
            await setProductsData(await getAllProducts());
            return;
        }
        try {
            const response = await searchProductsByName(query);
            setProductsData(response);
        } catch (error) {
            console.error("Error searching products:", error);
            setProductsData([]);
        }
    }

    const handleChangeProductToLaunch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (selectedProductLaunch) {
            setSelectedProductLaunch((prevData) => ({
                ...prevData!,
                [name]: value
            }));
        } 
    };

    const enviarLancamento = async () => {
        console.log(user)
        try {
            const response = await launchProduct(selectedProductLaunch, lancType);
            const responseLaunch = await createLaunch({
                ID_LancProd: 0,
                LancProd_IDProd: selectedProductLaunch.ID_Prod,
                LancProd_CodProd: selectedProductLaunch.Prod_CodProduto,
                LancProd_QtdeLanc: Number(selectedProductLaunch.Prod_QuantidadeLancada),
                LancProd_CustoCompra: Number(selectedProductLaunch.Prod_CustoCompra),
                LancProd_Data: new Date().toISOString(),
                LancProd_OperadorId: user ? Number(user.sub) : 0,
                LancProd_OperadorName: user ? user.name : '',
                LancProd_Observacao: selectedProductLaunch.Prod_Observacao,
                LancProd_Tipo: lancType
            })
            handleCloseLancamentos();
            console.log("Lançamento realizado com sucesso:", response);
        } catch (error) {
            console.error("Error launching product:", error);
        }
    }

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
        setDisplayProductSearch(debouncedSearchTerm ? 'flex' : 'none');
    }, [debouncedSearchTerm]);

    return (
        <Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={{ ...style, '@media (max-width: 800px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Gerenciar Categorias
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                    <Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography variant="h6" textAlign="center">Nome da Categoria</Typography></TableCell>
                                        <TableCell><Typography variant="h6" textAlign="center">Prateleira</Typography></TableCell>
                                        <TableCell><Typography variant="h6" textAlign="center">Editar</Typography></TableCell>
                                        <TableCell><Typography variant="h6" textAlign="center">Excluir</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categorias.sort((a, b) => { if (a.Cat_Prateleira === 0 && b.Cat_Prateleira === 0) return 0; if (a.Cat_Prateleira === 0) return 1; if (b.Cat_Prateleira === 0) return -1; return a.Cat_Prateleira - b.Cat_Prateleira }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((categoria) => (
                                        <TableRow key={categoria.ID_CategoriaProduto}>
                                            <TableCell><Typography textAlign="center">{categoria.CatProd_Nome}</Typography></TableCell>
                                            <TableCell><Typography textAlign="center">{categoria.Cat_Prateleira === 0 ? "Sem Prateleira" : categoria.Cat_Prateleira}</Typography></TableCell>
                                            <TableCell sx={{ textAlign: "center" }}><Button onClick={() => handleSwitchModalMode({ID_CategoriaProduto: categoria.ID_CategoriaProduto, CatProd_Nome: categoria.CatProd_Nome, Cat_Prateleira: categoria.Cat_Prateleira})}><Icon>edit</Icon></Button></TableCell>
                                            <TableCell sx={{ textAlign: "center" }}><Button onClick={() => handleDeleteCategory(categoria.ID_CategoriaProduto)}><Icon>delete</Icon></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={categorias.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[3, 5, 7]}
                                sx={{ '@media (max-width: 800px)': { 
                                    '& .MuiTablePagination-selectLabel': {
                                        display: 'none'
                                    }
                                }}}
                            />
                        </TableContainer>
                    </Box>
                    
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} mt={2} sx={{ flexDirection: "column"  }}>
                        
                            {
                                modalMode === 0 && (
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"100%"} sx={{ gap: 2, '@media (max-width: 800px)': { width: "100%" } }}>
                                        <Typography component="label" htmlFor={`quantity`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                            Nova Categoria:
                                        </Typography>
                                        <TextField
                                            id={`quantity`}
                                            name={`quantity`}
                                            variant="outlined"
                                            value={nomeCategoria}
                                            onChange={(e) => {
                                                setNomeCategoria(e.target.value);
                                            }}
                                            inputProps = {{ style: { padding: "8px" } }}
                                        />
                                    </Box>
                                )
                            } 
                            {
                                modalMode === 1 && (
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"100%"} sx={{ gap: 2, '@media (max-width: 800px)': { width: "100%" } }}>
                                        <Typography component="label" htmlFor={`quantity`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                            Editar Categoria:
                                        </Typography>
                                        <TextField
                                            id={`quantity`}
                                            name={`quantity`}
                                            variant="outlined"
                                            value={categoriaToEdit ? categoriaToEdit.CatProd_Nome : ""}
                                            onChange={(e) => {
                                                if (categoriaToEdit) {
                                                    setCategoriaToEdit({ ...categoriaToEdit, CatProd_Nome: e.target.value });
                                                }
                                            }}
                                            inputProps = {{ style: { padding: "8px" } }}
                                        />
                                    </Box> 
                                )}
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"100%"} sx={{ gap: 2, '@media (max-width: 800px)': { width: "100%" } }}>
                                    <Typography component="label" htmlFor={`prateleira`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                        Número da Prateleira:
                                    </Typography>
                                    <TextField
                                        id={`prateleira`}
                                        name={`prateleira`}
                                        variant="outlined"
                                        value={modalMode === 1 ? categoriaToEdit?.Cat_Prateleira : prateleira}
                                        onChange={(e) => {
                                            if (modalMode === 1) {
                                                if (!categoriaToEdit) return;
                                                setCategoriaToEdit({ ...categoriaToEdit, Cat_Prateleira: Number(e.target.value) });
                                            } else {
                                                setPrateleira(Number(e.target.value));
                                            }
                                        }}
                                        inputProps = {{ style: { padding: "8px" } }}
                                    />
                                </Box>
                        <Box width={"100%"} display={"flex"} justifyContent={"space-evenly"} height={"100%"} gap={1} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>   
                            { modalMode === 0 &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleInsertCategory({ CatProd_Nome: nomeCategoria, Cat_Prateleira: prateleira })}
                                >
                                    <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}> Adicionar</Typography>
                                </Button>
                            }
                            {
                                modalMode === 1 &&
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditCategory(categoriaToEdit ? categoriaToEdit : {ID_CategoriaProduto: 0, CatProd_Nome: "", Cat_Prateleira: 0})}
                                    >
                                        <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}> Editar</Typography>
                                    </Button>
                            }
                            <Button onClick={() => { modalMode === 1 ? setModalMode(0) : setModalMode(0) }} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Switch Mode</Typography>
                            </Button>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Voltar</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openLancamentos}
                onClose={handleCloseLancamentos}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={{ ...style, '@media (max-width: 800px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Realizar Lançamento
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Tabs value={lancType} onChange={handleChangeLancType} aria-label="basic tabs example">
                            <Tab label="Entrada" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                            <Tab label="Saída" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                        </Tabs>
                    </Box>

                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} mt={2}>
                        <Box width={"100%"}>
                            <SearchField onSearchChange={setSearchTerm} />
                            <Box width={"100%"} display={displayProductSearch} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={2} >
                                {productsData.length > 0 && searchTerm.length > 0 &&
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                {productsData.slice(pageLaunch * rowsPerPageLaunch, pageLaunch * rowsPerPageLaunch + rowsPerPageLaunch).map((product) => (
                                                    <TableRow key={product.ID_Prod} hover sx={{ cursor: "pointer" }} onClick={() => { handleFillProductLaunchData(product) }}>
                                                        <TableCell sx={{ padding: "5px"}}><Typography textAlign="left" fontSize={14} fontFamily={'Arial'}>{product.Prod_CodProduto}</Typography></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            component="div"
                                            count={productsData.length}
                                            page={pageLaunch}
                                            onPageChange={handleChangePageLaunch}
                                            rowsPerPage={rowsPerPageLaunch}
                                            onRowsPerPageChange={handleChangeRowsPerPageLaunch}
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
                            <TextField 
                                label="Código do Produto" 
                                name="Prod_CodProduto" 
                                variant="outlined" 
                                placeholder="Digite o código de produto" 
                                disabled
                                value={selectedProductLaunch.Prod_CodProduto} 
                                onChange={handleChangeProductToLaunch} 
                                sx={{ width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                                required
                            />
                            <TextField 
                                label="Estoque" 
                                name="Prod_Estoque" 
                                variant="outlined"
                                disabled 
                                value={selectedProductLaunch.Prod_Estoque} 
                                onChange={handleChangeProductToLaunch} 
                                sx={{width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                            />
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, width: "100%" }}>
                            <TextField 
                                label="Quantidade a ser lançada" 
                                name="Prod_QuantidadeLancada" 
                                variant="outlined" 
                                placeholder="Digite a quantidade" 
                                type="number"
                                value={selectedProductLaunch.Prod_QuantidadeLancada} 
                                onChange={handleChangeProductToLaunch} 
                                sx={{width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                            />
                            { lancType === 0 &&
                                <TextField 
                                    label="Custo de Compra Unitário" 
                                    name="Prod_CustoCompra" 
                                    variant="outlined" 
                                    placeholder="Digite o custo de compra unitário" 
                                    value={selectedProductLaunch.Prod_CustoCompra} 
                                    onChange={handleChangeProductToLaunch} 
                                    type="number"  
                                    InputProps={{ 
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        inputProps: { min: 0 } 
                                    }} 
                                    sx={{width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' },'@media (max-width: 800px)': { width: "100%" } }} 
                                    onFocus={(event) => event.target.select()}
                                />
                            }
                        </Box>
                        <TextField
                            label="Observações"
                            name="Prod_Observacao"
                            variant="outlined"
                            placeholder="Digite alguma observação"
                            value={selectedProductLaunch.Prod_Observacao}
                            onChange={handleChangeProductToLaunch}
                            sx={{width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                        />
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2} mt={2} sx={{ flexDirection: "row"  }}>
                        <Button onClick={enviarLancamento} variant="contained" color="primary" sx={{ width: "100%" }}>
                            <Typography variant="h6" fontSize={14}>Confirmar Lançamento</Typography>
                        </Button>
                        <Button onClick={handleCloseLancamentos} variant="contained" color="primary" sx={{ width: "100%" }}>
                            <Typography variant="h6" fontSize={14} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Voltar</Typography>
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} padding={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Select
                    labelId="prodCategoria-select-label"
                    id="prodCategoria-select"
                    label="prodCategoria"
                    name="Prod_Categoria"
                    variant="outlined" 
                    defaultValue={filterCategory}
                    fullWidth
                    onChange={(e) => setFilterCategory(Number(e.target.value))}
                    MenuProps={MenuProps}
                    sx={{ width: "15%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }}
                >
                    <MenuItem value={-1}>Todas</MenuItem>
                    {categorias.map((categoria) => (
                        <MenuItem key={categoria.ID_CategoriaProduto} value={categoria.ID_CategoriaProduto}>
                            {categoria.CatProd_Nome}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <TableProducts
                products={productsData}
                categorias={categorias}
                filteredCategory={filterCategory}
             />
             <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} padding={2} sx={{ '@media (max-width: 800px)': { flexDirection: 'column' } }}>
                <ProtectedComponent allowedRoles={['1']}>
                    <Box width={"100%"}>
                        <Button onClick={() => navigate("/cadastro-produto")} variant="contained" color="primary" sx={{ padding: "15px", width: "100%" }}><Typography variant="h6" fontSize={14}>Adicionar Produto</Typography></Button>
                    </Box>
                </ProtectedComponent>
                <ProtectedComponent allowedRoles={['1']}>
                    <Box width={"100%"}>
                        <Button onClick={() => handleOpen()} variant="contained" color="primary" sx={{ padding: "15px", width: "100%" }}><Typography variant="h6" fontSize={14}>Gerenciar Categorias</Typography></Button>
                    </Box>
                </ProtectedComponent>
                <ProtectedComponent allowedRoles={['1']}>
                    <Box width={"100%"}>

                        <Button onClick={() => handleOpenLancamentos()} variant="contained" color="primary" sx={{ padding: "15px", width: "100%" }}><Typography variant="h6" fontSize={14}>Lançamentos</Typography></Button>
                    </Box>
                </ProtectedComponent>
                <Box sx={{ '@media (max-width: 800px)': { width: '100%' } }}>
                    <GenericButton name="Voltar" type="button" link="/" />
                </Box>
            </Box>
        </Box>
    );

} 