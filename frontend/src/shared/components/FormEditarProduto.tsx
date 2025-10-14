import { useNavigate, useParams } from "react-router-dom";
import { ProductDTO, ProductDTOInsert } from "../utils/DTOS";
import { useEffect, useState } from "react";
import { createProduct, getProductById, updateProduct } from "../services/productService";
import { Box, TextField, Select, MenuItem, Typography, Checkbox, Button, InputAdornment } from "@mui/material";
import { GenericButton } from "./GenericButton";


export const FormEditarProduto: React.FC = () => {
    let idProd = parseInt(useParams().id || "0");
    const [product, setProduct] = useState<ProductDTO | null>(null);
    const [formData, setFormData] = useState<ProductDTO | null>({
        ID_Prod: idProd,
        Prod_Valor: 0,
        Prod_CustoCompra: 0,
        Prod_CFOP: '',
        Prod_NCM: 0,
        Prod_UnMedida: '',
        Prod_CodProduto: '',
        Prod_CodBarras: 0,
        Prod_Nome: '',
        Prod_Estoque: 0
    });
    const valor = 0;
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await getProductById(idProd);
            if (productData) {
                setFormData(productData);
                setProduct(productData);
            }
            
        };
        fetchProduct();
    }, [idProd]);

    
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const updatedProduct: ProductDTO = {
                ID_Prod: idProd,
                Prod_Valor: valor,
                Prod_CustoCompra: formData.get("prodCustoCompra") as unknown as number || 0,
                Prod_CFOP: formData.get("prodCFOP") as string,
                Prod_NCM: formData.get("prodNCM") as unknown as number || 0,
                Prod_UnMedida: formData.get("prodUN") as string,
                Prod_CodProduto: formData.get("codigoProduto") as string,
                Prod_CodBarras: formData.get("codigoBarras") as unknown as number || 0,
                Prod_Nome: formData.get("nomeProduto") as string,
                Prod_Estoque: formData.get("prodEstoque") as unknown as number || 0,
            }
            await updateProduct(updatedProduct);
        } catch (error) {
            console.error("Error creating product:", error);
        }

       // navigate("/estoque-produtos");
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevData => {
            if (!prevData) return prevData;
            return {
                ...prevData,
                [name]: value,
            } as ProductDTO;
        });
    };

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
                    <TextField label="Código de Barras" id="codigoBarras" name="Prod_CodBarras" variant="outlined" placeholder="Digite o código de barras" value={formData?.Prod_CodBarras} onChange={handleChange} sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '@media (max-width: 600px)': { width: "100%" } }} />

                    <TextField label="Código do Produto" id="codigoProduto" name="Prod_CodProduto" variant="outlined" placeholder="Digite o código de produto" value={formData?.Prod_CodProduto} onChange={handleChange} sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="Nome do Produto" id="nomeProduto" name="Prod_Nome" variant="outlined" placeholder="Digite o nome do produto" value={formData?.Prod_Nome} onChange={handleChange} sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField label="Unidade de Medida" id="prodUN" name="Prod_UnMedida" variant="outlined" placeholder="Digite a unidade de medida" value={formData?.Prod_UnMedida} onChange={handleChange} sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="NCM" id="prodNCM" name="Prod_NCM" variant="outlined" placeholder="Digite o NCM" value={formData?.Prod_NCM} onChange={handleChange} sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    }, '@media (max-width: 600px)': { width: "15%" } }} />
                    <TextField label="Estoque" id="prodEstoque" name="Prod_Estoque" variant="outlined" placeholder="Digite o estoque" value={formData?.Prod_Estoque} onChange={handleChange} sx={{ width: "33.33%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField label="CFOP" id="prodCFOP" name="Prod_CFOP" variant="outlined" placeholder="Digite o CFOP" value={formData?.Prod_CFOP} onChange={handleChange} sx={{ width: "50%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    } }} />
                    <TextField label="Custo de Compra" id="prodCustoCompra" name="Prod_CustoCompra" variant="outlined" placeholder="Digite o custo de compra" value={formData?.Prod_CustoCompra} onChange={handleChange}  slotProps={{
                        input: {
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        },
                    }} sx={{ width: "50%", '& .MuiInputLabel-root': {
                        color: 'gray', // Cor do label normal
                    }, '& .css-yo7muh-MuiTypography-root':{ color: 'black' }, '& .MuiInputLabel-root.Mui-focused': {
                        color: '#181393', // Cor do label quando em foco
                    },'@media (max-width: 600px)': { width: "15%" } }} />
                </Box>
            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Box>
                    <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 600px)': { width: "100%" }  }}>
                        <Typography variant="h6" color="text.secondary" sx={{ '@media (max-width: 600px)': { fontSize: "1rem" } }} >
                            Editar
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