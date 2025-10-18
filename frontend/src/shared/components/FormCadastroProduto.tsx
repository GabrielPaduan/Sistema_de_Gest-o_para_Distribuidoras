import { useNavigate } from "react-router-dom";
import { ProductDTOInsert } from "../utils/DTOS";
import { SetStateAction, useEffect, useState } from "react";
import { createProduct } from "../services/productService";
import { Box, TextField, Select, MenuItem, Typography, Checkbox, Button, InputAdornment } from "@mui/material";
import { GenericButton } from "./GenericButton";

export const FormCadastroProduto: React.FC = () => {
    const [product, setProduct] = useState<ProductDTOInsert | null>(null);
    const [custoCompra, setCustoCompra] = useState<number | 0>(0);
    const [porcentagemLucro, setPorcentagemLucro] = useState<number | 0>(0);
    const [valor, setValor] = useState<number | 0>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const navigate = useNavigate();
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
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
            }
            await createProduct(newProduct);
        } catch (error) {
            console.error("Error creating product:", error);
        }

        navigate("/estoque-produtos");
    }

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
        <Box
            component="form"
            noValidate
            autoComplete="off"
            padding={4}
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={"70%"}
            sx={{ '@media (max-width: 600px)': { maxWidth: "95%", padding: "10px" } }}
            margin="auto"
            onSubmit={submitForm}
        >
            <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 600px)': { flexDirection: "column", gap: 2 } }}>
                    <TextField label="Em desenvolvimento..." id="codigoBarras" name="codigoBarras" variant="outlined" placeholder="Em desenvolvimento..." sx={{ width: "33.33%", '@media (max-width: 600px)': { width: "100%" }, '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }}
                    type="number"
                    disabled/>

                    <TextField label="Código do Produto" id="codigoProduto" name="codigoProduto" variant="outlined" placeholder="Digite o código de produto" sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="Nome do Produto" id="nomeProduto" name="nomeProduto" variant="outlined" placeholder="Digite o nome do produto" sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />

                </Box>
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField label="Unidade de Medida" id="prodUN" name="prodUN" variant="outlined" placeholder="Digite a unidade de medida" sx={{ width: "25%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="NCM" id="prodNCM" name="prodNCM" variant="outlined" placeholder="Digite o NCM" sx={{ width: "25%", '@media (max-width: 600px)': { width: "15%" }, '& .MuiInputLabel-root': {
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
                    }} sx={{ width: "50%", '@media (max-width: 600px)': { width: "15%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': {
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
                    }} sx={{ width: "50%", '@media (max-width: 600px)': { width: "15%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': {
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
                    }} sx={{ width: "50%", '@media (max-width: 600px)': { width: "15%" }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root': {
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
                    <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 600px)': { width: "100%" } }}>
                        <Typography variant="h6" color="text.secondary" sx={{ '@media (max-width: 600px)': { fontSize: "1rem" } }} >
                            Cadastrar
                        </Typography>
                    </Button>
                </Box>
                <Box>
                    <GenericButton name="Voltar" type="button" link="/estoque-produtos" />
                </Box>
            </Box>
        </Box>
    )
}