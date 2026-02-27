import { useNavigate, useParams } from "react-router-dom";
import { ProductDTO, ProductLaunch, ProductLaunching, ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from "../utils/DTOS"; 
import { useEffect, useState } from "react";
import { getProductById, launchProduct, updateProduct } from "../services/productService"; 
import { Box, TextField, Typography, Button, InputAdornment, CircularProgress, Alert, Select, MenuItem, Modal, SelectChangeEvent, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, Tabs, Tab, TablePagination } from "@mui/material";
import { GenericButton } from "./GenericButton";
import { createCategory, getAllCategories } from "../services/categoriasProdutoService";
import { format } from "date-fns";

import { useShortcut } from "../hooks/useShortcut";
import { createLaunch, getLaunchByProductId } from "../services/productLaunchService";
import { ProtectedComponent } from "./ProtectedComponent";
import { useAuth } from "../context";

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

export const FormEditarProduto: React.FC = () => {
    let idProd = parseInt(useParams().id || "0");
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProductDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<ProductsCategoriesDTO[]>([]);
    const [open, setOpen] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState<string>('');
    const [prateleira, setPrateleira] = useState<number>(0);
    const [lancamentosProduto, setLancamentosProduto] = useState<ProductLaunch[]>([]);
    const [lancType, setLancType] = useState<0 | 1>(0);
    const [openLancamentos, setOpenLancamentos] = useState(false);
    const [selectedProductLaunch, setSelectedProductLaunch] = useState<ProductLaunching>({ ID_Prod: 0, Prod_CodProduto: "", Prod_Estoque: 0, Prod_CustoCompra: 0, Prod_Observacao: "", Prod_QuantidadeLancada: 0 });
    const { user } = useAuth();

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


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenLancamentos = () => setOpenLancamentos(true);
    const handleCloseLancamentos = () => {
        setOpenLancamentos(false);
    }

    const handleInsertCategory = async (nomeCategoria: ProductsCategoriesDTOInsert) => {
        await createCategory(nomeCategoria);
        const data = await getAllCategories();
        setCategorias(data);
        handleClose();
    }

     useEffect(() => {
        const fetchData = async () => {
            const data = await getAllCategories();
            setCategorias(data);
        }
        fetchData();
        
    }, []);

    useEffect(() => {
        if (idProd === 0) {
            setError("ID de produto inválido.");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const productData = await getProductById(idProd);
                setSelectedProductLaunch({
                    ID_Prod: productData.ID_Prod,
                    Prod_CodProduto: productData.Prod_CodProduto,
                    Prod_Estoque: productData.Prod_Estoque,
                    Prod_CustoCompra: productData.Prod_CustoCompra,
                    Prod_Observacao: "",
                    Prod_QuantidadeLancada: 0
                });
                const lancamentoData = await getLaunchByProductId(idProd);
                setLancamentosProduto(lancamentoData);
                if (productData) {
                    let calculatedPorcentagemLucro = productData.Prod_PorcLucro;
                    if (productData.Prod_CustoCompra > 0 && productData.Prod_Valor > 0) {
                        calculatedPorcentagemLucro = ((productData.Prod_Valor - productData.Prod_CustoCompra) / productData.Prod_CustoCompra) * 100;
                    }
                    
                    setFormData({
                        ...productData,
                        Prod_PorcLucro: parseFloat(calculatedPorcentagemLucro.toFixed(2))
                    });
                } else {
                    setError("Produto não encontrado.");
                }
            } catch (err) {
                console.error("Erro ao buscar produto:", err);
                setError("Falha ao carregar o produto. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchProduct();
    }, [idProd]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        
        setFormData(prevData => {
            if (!prevData) return null;
            
            const originalValue = prevData[name as keyof ProductDTO];
            let processedValue: string | number = value;

            if (typeof originalValue === 'number') {
                processedValue = parseFloat(value) || 0;
            }

            return {
                ...prevData,
                [name]: processedValue,
            };
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const { name, value } = event.target;
        
        setFormData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                [name]: Number(value) 
            }
        });
    };

    const handleCustoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCusto = parseFloat(e.target.value) || 0;
        
        setFormData(prevData => {
            if (!prevData) return null;

            const porcLucro = prevData.Prod_PorcLucro;
            let newValor = 0;

            if (newCusto > 0 && porcLucro > 0) {
                newValor = newCusto + (newCusto * porcLucro) / 100;
            }

            return {
                ...prevData,
                Prod_CustoCompra: newCusto,
                Prod_Valor: parseFloat(newValor.toFixed(2)),
            };
        });
    };

    useEffect(() => {
        if (formData) {
            handleCustoChange({ target: { value: formData.Prod_CustoCompra.toString() } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [formData?.Prod_CustoCompra]);

    const handlePorcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPorc = parseFloat(e.target.value) || 0;

        setFormData(prevData => {
            if (!prevData) return null;

            const custoCompra = prevData.Prod_CustoCompra;
            let newValor = 0;

            if (custoCompra > 0 && newPorc >= 0) { 
                newValor = custoCompra + (custoCompra * newPorc) / 100;
            }

            return {
                ...prevData,
                Prod_PorcLucro: newPorc,
                Prod_Valor: parseFloat(newValor.toFixed(2)),
            };
        });
    };

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValor = parseFloat(e.target.value) || 0;

        setFormData(prevData => {
            if (!prevData) return null;

            const custoCompra = prevData.Prod_CustoCompra;
            let newPorc = 0;

            if (custoCompra > 0 && newValor >= custoCompra) {
                newPorc = ((newValor - custoCompra) / custoCompra) * 100;
            }

            return {
                ...prevData,
                Prod_Valor: newValor,
                Prod_PorcLucro: parseFloat(newPorc.toFixed(2)),
            };
        });
    };

    const submitForm = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event?.preventDefault();
        
        if (!formData) {
            setError("Dados do formulário não estão carregados.");
            return;
        }

        try {
            setError(null); 
            const updatedProduct: ProductDTO = {
                ...formData,
                Prod_Valor: Number(formData.Prod_Valor) || 0,
                Prod_CustoCompra: Number(formData.Prod_CustoCompra) || 0,
                Prod_NCM: Number(formData.Prod_NCM) || 0,
                Prod_CodBarras: Number(formData.Prod_CodBarras) || 0,
                Prod_Estoque: Number(formData.Prod_Estoque) || 0,
                Prod_PorcLucro: Number(formData.Prod_PorcLucro) || 0,
                Prod_Categoria: Number(formData.Prod_Categoria) || 0,
            };
            console.log("Produto a ser atualizado:", updatedProduct);
            await updateProduct(updatedProduct);
            
            
            navigate(-1);

        } catch (error) {
            console.error("Error updating product:", error);
            setError("Falha ao salvar o produto. Tente novamente.");
        }
    };

    useShortcut("F1", () => submitForm());

    const fieldsDisabled = (formData?.Prod_CustoCompra || 0) <= 0;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!formData) {
        return (
            <Box display="flex" flexDirection="column" gap={2} justifyContent="center" alignItems="center" height="80vh">
                <Alert severity="error" sx={{ width: '100%', maxWidth: '70%' }}>{error || "Produto não pôde ser carregado."}</Alert>
                <GenericButton name="Voltar" type="button" onClick={() => navigate("/estoque-produtos")} />
            </Box>
        );
    }

    const handleChangeLancType = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            setLancType(0);
        } else {
            setLancType(1);
        }  
    };

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
                
                setFormData(prevData => {
                    if (!prevData) return null;
                    const estoqueAnterior = prevData.Prod_Estoque;
                    const novaQuantidadeLancada = Number(selectedProductLaunch.Prod_QuantidadeLancada) || 0;
                    const novoEstoque = lancType === 0 ? estoqueAnterior + novaQuantidadeLancada : estoqueAnterior - novaQuantidadeLancada;
                    if (lancType === 0) {
                        if (prevData.Prod_CustoCompra <= selectedProductLaunch.Prod_CustoCompra) {
                            const novoCustoCompra = selectedProductLaunch.Prod_CustoCompra;
                            
                            return {
                                ...prevData,
                                Prod_Estoque: novoEstoque,
                                Prod_CustoCompra: novoCustoCompra
                            };
                        } else {
                            selectedProductLaunch.Prod_CustoCompra = prevData.Prod_CustoCompra;
                        }
                    }
                    return {
                        ...prevData,
                        Prod_Estoque: novoEstoque
                    };
                });

                setLancamentosProduto(prevLancamentos => {
                    const newLancamento: ProductLaunch = {
                        ID_LancProd: responseLaunch.ID_LancProd,
                        LancProd_IDProd: selectedProductLaunch.ID_Prod,
                        LancProd_CodProd: selectedProductLaunch.Prod_CodProduto,
                        LancProd_QtdeLanc: Number(selectedProductLaunch.Prod_QuantidadeLancada),
                        LancProd_CustoCompra: Number(selectedProductLaunch.Prod_CustoCompra),
                        LancProd_Data: new Date().toISOString(),
                        LancProd_OperadorId: user ? Number(user.sub) : 0,
                        LancProd_OperadorName: user ? user.name : '',
                        LancProd_Observacao: selectedProductLaunch.Prod_Observacao,
                        LancProd_Tipo: lancType
                    };
                    return [...prevLancamentos, newLancamento];
                })
                    

            } catch (error) {
                console.error("Error launching product:", error);
            }
        }

    return (
        <>
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={{ ...style, '@media (max-width: 800px)': { width: "80%" } }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                            Adicionar Nova Categoria
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} mt={2} sx={{ flexDirection: "column"  }}>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"} width={"100%"} height={"100%"} sx={{ gap: 2, '@media (max-width: 800px)': { width: "100%" } }}>
                                <Typography component="label" htmlFor={`quantity`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                    Nome da Categoria:
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
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"100%"} sx={{ gap: 2, '@media (max-width: 800px)': { width: "100%" } }}>
                                <Typography component="label" htmlFor={`prateleira`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                    Número da Prateleira:
                                </Typography>
                                <TextField
                                    id={`prateleira`}
                                    name={`prateleira`}
                                    variant="outlined"
                                    value={prateleira}
                                    onChange={(e) => {
                                        setPrateleira(Number(e.target.value));
                                    }}
                                    inputProps = {{ style: { padding: "8px" } }}
                                />
                            </Box>
                            <Box width={"100%"} display={"flex"} justifyContent={"center"} height={"100%"} gap={1} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleInsertCategory({ CatProd_Nome: nomeCategoria, Cat_Prateleira: prateleira })}
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
            <Box
                component="form"
                noValidate
                autoComplete="off"
                padding={4}
                display="flex"
                flexDirection="column"
                gap={2}
                maxWidth={"70%"}
                sx={{ '@media (max-width: 800px)': { maxWidth: "95%", padding: "10px" } }}
                margin="auto"
                onSubmit={submitForm}
            >
                {error && <Alert severity="error">{error}</Alert>}

                <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
                    <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                        <TextField 
                            label="Código de Barras" 
                            name="Prod_CodBarras" 
                            variant="outlined" 
                            placeholder="Digite o código de barras" 
                            disabled
                            value={formData.Prod_CodBarras} 
                            onChange={handleChange} 
                            sx={{ width: "33.33%", '& .MuiInputLabel-root': { color: 'gray' }, '@media (max-width: 800px)': { width: "100%" } }} 
                        />

                        <TextField 
                            label="Código do Produto" 
                            name="Prod_CodProduto" 
                            variant="outlined" 
                            placeholder="Digite o código de produto" 
                            value={formData.Prod_CodProduto} 
                            onChange={handleChange} 
                            sx={{ width: "33.33%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                            required
                        />
                        <TextField 
                            label="Nome do Produto" 
                            name="Prod_Nome" 
                            variant="outlined" 
                            placeholder="Digite o nome do produto" 
                            value={formData.Prod_Nome} 
                            onChange={handleChange} 
                            sx={{ width: "33.33%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                            required
                        />

                        <Box display={"flex"} justifyContent={"space-evenly"} alignItems={"center"} width={"25%"} gap={2} sx={{ '@media (max-width: 800px)': { width: '100%' } }}>
                            <Select
                                labelId="prodCategoria-select-label"
                                id="prodCategoria-select"
                                label="prodCategoria"
                                name="Prod_Categoria"
                                variant="outlined" 
                                defaultValue={formData.Prod_Categoria || 0}
                                fullWidth
                                onChange={handleSelectChange}
                                MenuProps={MenuProps}
                                sx={{ width: "95%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' } }}
                            >
                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.ID_CategoriaProduto} value={categoria.ID_CategoriaProduto}>
                                        {categoria.CatProd_Nome}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button variant="contained" color="primary" sx={{ width: "5%", height: "auto" }} onClick={handleOpen}>+</Button>
                        </Box>
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                        <TextField 
                            label="Unidade de Medida" 
                            name="Prod_UnMedida" 
                            variant="outlined" 
                            placeholder="Digite a unidade de medida" 
                            value={formData.Prod_UnMedida} 
                            onChange={handleChange} 
                            sx={{ width: "25%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                        />
                        <TextField 
                            label="NCM" 
                            name="Prod_NCM" 
                            variant="outlined" 
                            placeholder="Digite o NCM" 
                            type="number"
                            value={formData.Prod_NCM} 
                            onChange={handleChange} 
                            sx={{ width: "25%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                        />
                        <TextField 
                            label="Estoque" 
                            name="Prod_Estoque" 
                            variant="outlined" 
                            placeholder="Digite o estoque" 
                            type="number"
                            value={formData.Prod_Estoque} 
                            onChange={handleChange} 
                            sx={{ width: "25%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                        />
                        <TextField 
                            label="CFOP" 
                            name="Prod_CFOP" 
                            variant="outlined" 
                            placeholder="Digite o CFOP" 
                            value={formData.Prod_CFOP} 
                            onChange={handleChange} 
                            sx={{ width: "25%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                        />
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                        <TextField 
                            label="Custo de Compra" 
                            name="Prod_CustoCompra" 
                            variant="outlined" 
                            placeholder="Digite o custo de compra" 
                            value={formData.Prod_CustoCompra} 
                            onChange={handleCustoChange} 
                            type="number"  
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                inputProps: { min: 0 }
                            }} 
                            sx={{ width: "33.33%", '& .MuiInputLabel-root': { color: 'gray' }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' },'@media (max-width: 800px)': { width: "100%" } }} 
                            onFocus={(event) => event.target.select()}
                        />

                        <TextField 
                            label="Porcentagem de Lucro" 
                            name="Prod_PorcLucro" 
                            variant="outlined" 
                            placeholder="Digite a porcentagem de lucro" 
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                inputProps: { min: 0 } 
                            }}
                            sx={{ width: "33.33%", '@media (max-width: 800px)': { width: "100%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' } }}  
                            value={formData.Prod_PorcLucro}
                            onChange={handlePorcChange}
                            disabled={fieldsDisabled} 
                            onFocus={(event) => event.target.select()}
                        />

                        <TextField 
                            label="Custo de Venda" 
                            name="Prod_Valor" 
                            variant="outlined" 
                            placeholder="Digite o custo de venda" 
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                inputProps: { min: 0 } 
                            }}
                            sx={{ width: "33.33%", '@media (max-width: 800px)': { width: "100%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }}}
                            value={formData.Prod_Valor}
                            onChange={handleValorChange} 
                            disabled={fieldsDisabled} 
                            onFocus={(event) => event.target.select()}
                        />
                    </Box>
                </Box>

                <Box width={"auto"} sx={{  maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, marginBottom: 2, '@media (max-width: 800px)': { maxWidth: "90%" }  }}>
                    <Typography variant="h6" gutterBottom>
                        Histórico de Lançamentos
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Tabs value={lancType} onChange={handleChangeLancType} aria-label="basic tabs example">
                            <Tab label="Entrada" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                            <Tab label="Saída" sx={{ color: 'black', opacity: 0.5, '&.Mui-selected': { opacity: 1 } }} />
                        </Tabs>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="h6" fontSize={16} textAlign={"center"}>Código de Produto</Typography></TableCell>
                                    <TableCell><Typography variant="h6" fontSize={16} textAlign={"center"}>Quantidade Lançada</Typography></TableCell>
                                    {
                                        lancType === 0 &&
                                        <TableCell><Typography variant="h6" fontSize={16} textAlign={"center"}>Custo de Compra</Typography></TableCell>
                                    }
                                    <TableCell><Typography variant="h6" fontSize={16} textAlign={"center"}>Data | Hora</Typography></TableCell>
                                    <TableCell><Typography variant="h6" fontSize={16} textAlign={"center"}>Operador</Typography></TableCell>
                                    <TableCell><Typography variant="h6" fontSize={16} textAlign={"center"}>Observação</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    lancamentosProduto.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="h6" fontSize={14} textAlign={"center"}>Nenhum lançamento encontrado para este produto.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                {
                                lancamentosProduto.length > 0 && lancType === 0 && lancamentosProduto.sort((a, b) => new Date(b.LancProd_Data).getTime() - new Date(a.LancProd_Data).getTime()).filter(l => l.LancProd_Tipo === 0).map((lancamento) => (
                                    <TableRow  key={lancamento.ID_LancProd}>    
                                        <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_CodProd}</Typography></TableCell>
                                        <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_QtdeLanc}</Typography></TableCell>
                                        <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>R${lancamento.LancProd_CustoCompra}</Typography></TableCell>
                                        <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{format(new Date(lancamento.LancProd_Data), 'dd/MM/yyyy | HH:mm')}</Typography></TableCell>
                                        <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_OperadorName}</Typography></TableCell>
                                        <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_Observacao ? lancamento.LancProd_Observacao : "Sem Observação"}</Typography></TableCell>
                                    </TableRow>
                                ))}
                                {
                                    lancamentosProduto.length > 0 && lancType === 1 && lancamentosProduto.sort((a, b) => new Date(b.LancProd_Data).getTime() - new Date(a.LancProd_Data).getTime()).filter(l => l.LancProd_Tipo === 1).map((lancamento) => (
                                        <TableRow key={lancamento.ID_LancProd}>    
                                            <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_CodProd}</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_QtdeLanc}</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{format(new Date(lancamento.LancProd_Data), 'dd/MM/yyyy | HH:mm')}</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_OperadorName}</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize={14} textAlign={"center"}>{lancamento.LancProd_Observacao ? lancamento.LancProd_Observacao : "Sem Observação"}</Typography></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <ProtectedComponent allowedRoles={['1']}>
                        <Box>
                            <Button onClick={() => handleOpenLancamentos()} variant="contained" color="primary" sx={{ padding: "15px", width: "100%" }}><Typography variant="h6" fontSize={14}>Lançamentos</Typography></Button>
                        </Box>
                    </ProtectedComponent>
                    <Box>
                        <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 800px)': { width: "100%" }  }}>
                            <Typography variant="h6" fontSize={14} color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }} >
                                Salvar Alterações [F1]
                            </Typography>
                        </Button>
                    </Box>
                    <Box>
                        <GenericButton name="Voltar" type="button" onClick={() => navigate(-1)} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}