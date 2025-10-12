import { useNavigate } from "react-router-dom";
import { ProductDTOInsert } from "../utils/DTOS";
import { useState } from "react";
import { createProduct } from "../services/productService";

export const FormCadastroProduto = () => {
    const [product, setProduct] = useState<ProductDTOInsert | null>(null);
    const navigate = useNavigate();
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const newProduct: ProductDTOInsert = {
                Prod_Valor: formData.get("valor") as unknown as number,
                Prod_CustoCompra: formData.get("custoCompra") as unknown as number,
                Prod_CFOP: formData.get("cfop") as string,
                Prod_NCM: formData.get("ncm") as unknown as number,
                Prod_UnMedida: formData.get("unMedida") as string,
                Prod_CodProduto: formData.get("codProduto") as string,
                Prod_CodBarras: formData.get("codBarras") as string,
                Prod_Nome: formData.get("nome") as string,
                Prod_Estoque: formData.get("estoque") as unknown as number,
            }
            await createProduct(newProduct);
        } catch (error) {
            console.error("Error creating product:", error);
        }

        navigate("/estoque-produtos");
    }
    return (
        <>
            
        </>
    )
}