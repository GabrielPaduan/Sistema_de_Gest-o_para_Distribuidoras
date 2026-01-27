import { useNavigate, useParams } from "react-router-dom";
import { ProductDTO, ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from "../utils/DTOS"; // Removi ProductDTOInsert, pois não está sendo usado
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../services/productService"; // Removi createProduct
import { Box, TextField, Typography, Button, InputAdornment, CircularProgress, Alert, Select, MenuItem, Modal, SelectChangeEvent } from "@mui/material";
import { GenericButton } from "./GenericButton";
import { NumericFormat } from "react-number-format";
import { createCategory, getAllCategories } from "../services/categoriasProdutoService";
import { get } from "http";

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

    // --- Estado Refatorado ---
    // 1. Fonte única da verdade para os dados do formulário
    const [formData, setFormData] = useState<ProductDTO | null>(null);
    
    // 2. Estados para controle da UI
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<ProductsCategoriesDTO[]>([]);

    const [open, setOpen] = useState(false);

    const [nomeCategoria, setNomeCategoria] = useState<string>('');
    const [prateleira, setPrateleira] = useState<number>(0);

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

    // --- Carregamento dos Dados ---
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
                
                if (productData) {
                    // Calcula a % de lucro inicial corretamente ao carregar
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

    // --- Handlers de Mudança ---

    // Handler genérico para campos simples
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        
        setFormData(prevData => {
            if (!prevData) return null;
            
            const originalValue = prevData[name as keyof ProductDTO];
            let processedValue: string | number = value;

            // Mantém o tipo do dado (se era número, converte para número)
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
                [name]: Number(value) // Garante que o valor salvo seja sempre um número, 
            }
        });
    };

    // Handler específico para Custo de Compra
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

    // Handler específico para Porcentagem de Lucro
    const handlePorcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPorc = parseFloat(e.target.value) || 0;

        setFormData(prevData => {
            if (!prevData) return null;

            const custoCompra = prevData.Prod_CustoCompra;
            let newValor = 0;

            if (custoCompra > 0 && newPorc >= 0) { // Permite lucro 0
                newValor = custoCompra + (custoCompra * newPorc) / 100;
            }

            return {
                ...prevData,
                Prod_PorcLucro: newPorc,
                Prod_Valor: parseFloat(newValor.toFixed(2)),
            };
        });
    };

    // Handler específico para Custo de Venda (Valor)
    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValor = parseFloat(e.target.value) || 0;

        setFormData(prevData => {
            if (!prevData) return null;

            const custoCompra = prevData.Prod_CustoCompra;
            let newPorc = 0;

            // Só calcula % se o valor de venda for maior ou igual ao custo
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


    // --- Submissão do Formulário ---
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!formData) {
            setError("Dados do formulário não estão carregados.");
            return;
        }

        try {
            setError(null); // Limpa erros antigos
            // O objeto a ser enviado é o próprio estado.
            const updatedProduct: ProductDTO = {
                ...formData,
                // Garantir que os tipos numéricos sejam números
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

    // --- Renderização ---

    // Estado de "disabled" agora é derivado, não um estado
    const fieldsDisabled = (formData?.Prod_CustoCompra || 0) <= 0;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    // Não exibe o formulário se deu erro no carregamento inicial
    if (!formData) {
        return (
            <Box display="flex" flexDirection="column" gap={2} justifyContent="center" alignItems="center" height="80vh">
                <Alert severity="error" sx={{ width: '100%', maxWidth: '70%' }}>{error || "Produto não pôde ser carregado."}</Alert>
                <GenericButton name="Voltar" type="button" link="/estoque-produtos" />
            </Box>
        );
    }

    return (
        <>
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

                        {/* <TextField variant="filled"  label="Código do Produto" name="codigoProduto" required placeholder="Digite o código do produto" fullWidth sx={{ marginBottom: 2 }}/> */}
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
                {/* Exibe erro de submissão */}
                {error && <Alert severity="error">{error}</Alert>}

                <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
                    <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                        <TextField 
                            label="Código de Barras" 
                            name="Prod_CodBarras" 
                            variant="outlined" 
                            placeholder="Digite o código de barras" 
                            disabled // Campo código de barras desabilitado como no original
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

                        <Box display={"flex"} justifyContent={"space-evenly"} alignItems={"center"} width={"25%"} gap={2}>
                            <Select
                                labelId="prodCategoria-select-label"
                                id="prodCategoria-select"
                                label="prodCategoria"
                                name="Prod_Categoria"
                                variant="outlined" 
                                defaultValue={formData.Prod_Categoria || 0}
                                fullWidth
                                onChange={handleSelectChange}
                                // ADICIONE ESTA LINHA AQUI:
                                MenuProps={MenuProps}
                                sx={{ width: "95%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' } }}
                            >
                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.ID_CategoriaProduto} value={categoria.ID_CategoriaProduto}>
                                        {categoria.CatProd_Nome}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button variant="contained" color="primary" sx={{ width: "5%", height: "100%" }} onClick={handleOpen}>+</Button>
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
                            onChange={handleCustoChange} // Handler específico
                            type="number"  
                            InputProps={{ // Prop correta é InputProps
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                inputProps: { min: 0 } // Evita valores negativos
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
                            onChange={handlePorcChange} // Handler específico
                            disabled={fieldsDisabled} // Lógica de disabled simplificada
                            onFocus={(event) => event.target.select()}
                        />

                        <TextField 
                            label="Custo de Venda" 
                            name="Prod_Valor" // Nome correto do campo no DTO
                            variant="outlined" 
                            placeholder="Digite o custo de venda" 
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                inputProps: { min: 0 } 
                            }}
                            sx={{ width: "33.33%", '@media (max-width: 800px)': { width: "100%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }}}
                            value={formData.Prod_Valor}
                            onChange={handleValorChange} // Handler específico  
                            disabled={fieldsDisabled} // Lógica de disabled simplificada
                            onFocus={(event) => event.target.select()}
                        />
                    </Box>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                    <Box>
                        <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 800px)': { width: "100%" }  }}>
                            <Typography variant="h6" color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }} >
                                Salvar Alterações
                            </Typography>
                        </Button>
                    </Box>
                    <Box>
                        <GenericButton name="Voltar" type="button" link="" onClick={() => navigate(-1)} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}