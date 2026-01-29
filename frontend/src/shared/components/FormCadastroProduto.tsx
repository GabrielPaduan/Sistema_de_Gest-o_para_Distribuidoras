import { useNavigate } from "react-router-dom";
import { ProductDTOInsert, ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from "../utils/DTOS";
import { SetStateAction, useEffect, useState } from "react";
import { createProduct } from "../services/productService";
import { Box, TextField, Select, MenuItem, Typography, Checkbox, Button, InputAdornment, Modal } from "@mui/material";
import { GenericButton } from "./GenericButton";
import { createCategory, getAllCategories } from "../services/categoriasProdutoService";
import { useShortcut } from "../hooks";

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

export const FormCadastroProduto: React.FC = () => {
    const [categorias, setCategorias] = useState<ProductsCategoriesDTO[]>([]);
    const [custoCompra, setCustoCompra] = useState<number | 0>(0);
    const [porcentagemLucro, setPorcentagemLucro] = useState<number | 0>(0);
    const [valor, setValor] = useState<number | 0>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [nomeCategoria, setNomeCategoria] = useState<string>('');
    const [prateleira, setPrateleira] = useState<number>(0);
    
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
        
        console.log(categorias);
    }, []);


    const submitForm = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        try {
            const formData = new FormData(event?.currentTarget);
            const newProduct: ProductDTOInsert = {
                Prod_Valor: valor,
                Prod_CustoCompra: formData.get("prodCustoCompra") as unknown as number || 0,
                Prod_CFOP: formData.get("prodCFOP") as string,
                Prod_NCM: formData.get("prodNCM") as unknown as number || 0,
                Prod_UnMedida: formData.get("prodUN") as string,
                Prod_CodProduto: formData.get("codigoProduto") as string,
                Prod_CodBarras: formData.get("codigoBarras") as unknown as number || 0,
                Prod_Nome: formData.get("nomeProduto") as string,
                Prod_Estoque: formData.get("prodEstoque") as unknown as number || 0,
                Prod_PorcLucro: formData.get("prodPorcLucro") as unknown as number || 0,
                Prod_Categoria: formData.get("prodCategoria") as unknown as number || 0,
            }
            await createProduct(newProduct);
        } catch (error) {
            console.error("Error creating product:", error);
        }

        navigate("/estoque-produtos");
    }

    useShortcut("F1", () => submitForm());

    useEffect(() => {
        if (custoCompra === 0) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }

        if (custoCompra > 0 && porcentagemLucro > 0) {
            const valorVenda = custoCompra + (custoCompra * porcentagemLucro) / 100;
            setValor(parseFloat(valorVenda.toFixed(2)));
        }
    }, [custoCompra, porcentagemLucro]);

    useEffect(() => {
        if (valor > 0 && custoCompra > 0) {
            const porcLucro = ((valor - custoCompra) / custoCompra) * 100;
            setPorcentagemLucro(parseFloat(porcLucro.toFixed(2)));
        } else if (valor < custoCompra) {
            setValor(0);
        }
    }, [valor]);

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
            <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                    <TextField label="Em desenvolvimento..." id="codigoBarras" name="codigoBarras" variant="outlined" placeholder="Em desenvolvimento..." sx={{ width: "25%", '@media (max-width: 800px)': { width: "100%" }, '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }}
                    type="number"
                    disabled/>

                    <TextField label="Código do Produto" id="codigoProduto" name="codigoProduto" variant="outlined" placeholder="Digite o código de produto" sx={{ width: "25%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="Nome do Produto" id="nomeProduto" name="nomeProduto" variant="outlined" placeholder="Digite o nome do produto" sx={{ width: "25%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />

                    <Box display={"flex"} justifyContent={"space-evenly"} alignItems={"center"} width={"25%"} gap={2}>
                        <Select
                            labelId="prodCategoria-select-label"
                            id="prodCategoria-select"
                            label="prodCategoria"
                            name="prodCategoria"
                            defaultValue={0}
                            fullWidth
                            sx={{ width: "100%", marginLeft: 0.5 }}
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
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField label="Unidade de Medida" id="prodUN" name="prodUN" variant="outlined" placeholder="Digite a unidade de medida" sx={{ width: "25%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="NCM" id="prodNCM" name="prodNCM" variant="outlined" placeholder="Digite o NCM" sx={{ width: "25%", '@media (max-width: 800px)': { width: "15%" }, '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} 
                    type="number"
                    />
                    <TextField label="Estoque" id="prodEstoque" name="prodEstoque" variant="outlined" placeholder="Digite o estoque" sx={{ width: "25%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }}
                    type="number"
                    />
                    <TextField label="CFOP" id="prodCFOP" name="prodCFOP" variant="outlined" placeholder="Digite o CFOP" sx={{ width: "25%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField label="Custo de Compra" id="prodCustoCompra" name="prodCustoCompra" variant="outlined" placeholder="Digite o custo de compra" slotProps={{
                        input: {
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        },
                    }} sx={{ width: "50%", '@media (max-width: 800px)': { width: "15%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }}
                    value={custoCompra}
                    onChange={(e) => setCustoCompra(Number(e.target.value))}
                    type="number"
                    />
                    <TextField label="Porcentagem de Lucro" id="prodPorcLucro" name="prodPorcLucro" variant="outlined" placeholder="Digite a porcentagem de lucro" slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        },
                    }} sx={{ width: "50%", '@media (max-width: 800px)': { width: "15%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }}  
                    value={porcentagemLucro}
                    onChange={(e) => setPorcentagemLucro(Number(e.target.value))}
                    disabled={disabled}
                    type="number"
                    />
                    <TextField label="Custo de Venda" id="prodCustoVenda" name="prodCustoVenda" variant="outlined" placeholder="Digite o custo de venda" slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        },
                    }} sx={{ width: "50%", '@media (max-width: 800px)': { width: "15%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    }}}
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}    
                    disabled={disabled}
                    type="number"
                    />
                
                </Box>
            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Box>
                    <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 800px)': { width: "100%" } }}>
                        <Typography variant="h6" color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }} >
                            Cadastrar [F1]
                        </Typography>
                    </Button>
                </Box>
                <Box>
                    <GenericButton name="Voltar" type="button" link="/estoque-produtos" />
                </Box>
            </Box>
        </Box>
    </>
    )
}