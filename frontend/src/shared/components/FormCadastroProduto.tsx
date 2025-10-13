import { useNavigate } from "react-router-dom";
import { ProductDTOInsert } from "../utils/DTOS";
import { useState } from "react";
import { createProduct } from "../services/productService";
import { Box, TextField, Select, MenuItem, Typography, Checkbox, Button } from "@mui/material";
import { GenericButton } from "./GenericButton";

export const FormCadastroProduto: React.FC = () => {
    const [product, setProduct] = useState<ProductDTOInsert | null>(null);
    const valor = 0;
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
            }
            await createProduct(newProduct);
        } catch (error) {
            console.error("Error creating product:", error);
        }

        navigate("/estoque-produtos");
    }
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
                    <TextField id="codigoBarras" name="codigoBarras" variant="outlined" placeholder="Digite o código de barras" sx={{ width: "33.33%", '@media (max-width: 600px)': { width: "100%" } }} />

                    <TextField id="codigoProduto" name="codigoProduto" variant="outlined" placeholder="Digite o código de produto" sx={{ width: "33.33%" }} />
                    <TextField id="nomeProduto" name="nomeProduto" variant="outlined" placeholder="Digite o nome do produto" sx={{ width: "33.33%" }} />
             
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField id="prodUN" name="prodUN" variant="outlined" placeholder="Digite a unidade de medida" sx={{ width: "33.33%" }} />
                    <TextField id="prodNCM" name="prodNCM" variant="outlined" placeholder="Digite o NCM" sx={{ width: "33.33%", '@media (max-width: 600px)': { width: "15%" } }} />
                    <TextField id="prodEstoque" name="prodEstoque" variant="outlined" placeholder="Digite o estoque" sx={{ width: "33.33%" }} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} gap={2}>
                    <TextField id="prodCFOP" name="prodCFOP" variant="outlined" placeholder="Digite o CFOP" sx={{ width: "50%" }} />
                    <TextField id="prodCustoCompra" name="prodCustoCompra" variant="outlined" placeholder="Digite o custo de compra" sx={{ width: "50%", '@media (max-width: 600px)': { width: "15%" } }} />
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