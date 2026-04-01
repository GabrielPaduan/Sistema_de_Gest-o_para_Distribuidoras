import { Box, Button, Checkbox, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { objectContractExclusion, ProductsCategoriesDTO, TableContractProps } from "../utils/DTOS";
import React from "react";
import { ProtectedComponent } from "./ProtectedComponent";
import { useNavigate } from "react-router-dom";

interface CustomTableContractProps extends TableContractProps {
    onAddProduct: (productId: number, cmdt: number) => void;
    onRemoveProduct: (productId: number) => void;
    onRemoveContract: (contractId: number, productId: number) => void;
    openEditContract: (contractId: number, productId: number) => void;
    selectedItems: objectContractExclusion[]; 
    onToggleSelect: (contractId: number, productId: number) => void;
    productCategories: ProductsCategoriesDTO[];
}

export const TableContract: React.FC<CustomTableContractProps> = ({ contracts, products, selectedItems,
    onToggleSelect, onAddProduct, onRemoveProduct, onRemoveContract, openEditContract, productCategories }) => {
    const navigate = useNavigate();

    const productMap = new Map(products.map(p => [p.ID_Prod, p]));
    const categoryMap = new Map(productCategories.map(cat => [cat.ID_CategoriaProduto, cat]));

    const sortedContracts = [...contracts].sort((a, b) => {
        const productA = productMap.get(a.Cont_ID_Prod);
        const productB = productMap.get(b.Cont_ID_Prod);

        const categoriaA = productA ? categoryMap.get(productA.Prod_Categoria) : undefined;
        const categoriaB = productB ? categoryMap.get(productB.Prod_Categoria) : undefined;
        
        if (!categoriaA || !categoriaB) {
            return 0;
        }

        const shelfA = categoriaA.Cat_Prateleira;
        const shelfB = categoriaB.Cat_Prateleira;
        
        const codeA = productA?.Prod_CodProduto || "";
        const codeB = productB?.Prod_CodProduto || "";
        const nameA = categoriaA.CatProd_Nome || "";
        const nameB = categoriaB.CatProd_Nome || "";

        const sortOptions = { numeric: true, sensitivity: 'base' } as const;

        if (shelfA === 0 && shelfB !== 0) return 1;
        if (shelfB === 0 && shelfA !== 0) return -1;

        if (shelfA === 0 && shelfB === 0) {
            const nameCompare = nameA.localeCompare(nameB, undefined, sortOptions);
            if (nameCompare !== 0) return nameCompare;
            
            return codeA.localeCompare(codeB, undefined, sortOptions);
        }
        
        if (shelfA === shelfB) {
            return codeA.localeCompare(codeB, undefined, sortOptions);
        }
        
        return shelfA - shelfB;
    });
    return (
        <TableContainer component={Paper} sx={{ margin: "auto", cursor: "default", width: "100%" }}>
            <Table width="100%">
                <TableHead>
                <ProtectedComponent allowedRoles={['1']}>
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>
                        Selecionar
                    </TableCell>
                </ProtectedComponent>
                    <TableCell  sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Cmdt</TableCell>
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Produtos</TableCell>
                    <TableCell  sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Categoria</TableCell>
                    <ProtectedComponent allowedRoles={['1']}>
                        <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px", display: "none" } }}>Custo Compra</TableCell>
                        <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px", display: "none" } }}>Porcentagem Lucro</TableCell>
                    </ProtectedComponent>
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px", display: "none" } }}>Valor Venda</TableCell>
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Reposição</TableCell>
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Estoque</TableCell>
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Valor Total</TableCell>
                    <ProtectedComponent allowedRoles={['1']}>
                        <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Editar</TableCell>
                        <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>%</TableCell>
                        <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Remover</TableCell>
                    </ProtectedComponent>

                </TableHead>
                <TableBody>
                    {
                    sortedContracts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={13} sx={{ textAlign: "center", fontSize: 14 }}>Nenhum contrato cadastrado</TableCell>
                        </TableRow>
                    ) : (
                        
                        sortedContracts.map((contract) => {
                            const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
                            if (!product) return null;
                        
                            return (
                                <TableRow key={contract.ID_Contrato} hover>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>
                                            <Checkbox
                                            checked={selectedItems.some(item => item.contractId === contract.ID_Contrato)}
                                            onChange={() => onToggleSelect(contract.ID_Contrato, product.ID_Prod)}
                                            sx={{ width: '9%', color: 'grey' }}
                                            color="secondary"
                                        /></TableCell>
                                    </ProtectedComponent>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{contract.Cont_Comodato}</TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{product.Prod_CodProduto}</TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{product.Prod_Categoria >= 0 ? productCategories.find(cat => cat.ID_CategoriaProduto === product.Prod_Categoria)?.CatProd_Nome : ''}</TableCell>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", display: "none" } }}>R$ {product.Prod_CustoCompra.toFixed(2)}</TableCell>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", display: "none" } }}>{contract.Cont_PorcLucro > 0 ? contract.Cont_PorcLucro : product.Prod_PorcLucro}%</TableCell>
                                    </ProtectedComponent>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", display: "none" } }}>R$ { contract.Cont_PorcLucro > 0 ? (product.Prod_CustoCompra + (product.Prod_CustoCompra * (contract.Cont_PorcLucro / 100))).toFixed(2) : (product.Prod_CustoCompra + (product.Prod_CustoCompra * (product.Prod_PorcLucro / 100))).toFixed(2) || 0}
                                        
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <Button onClick={() => onRemoveProduct(contract.ID_Contrato)} sx={{ '@media (max-width: 800px)': { padding: "0px", minWidth: "40px" } }}><Icon sx={{ fontSize: 14, '@media (max-width: 800px)': { fontSize: "20px", padding: "0px" } }}>remove_circle</Icon></Button>
                                                <Typography sx={{ fontSize: 12, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "0px" } }}>{contract.Cont_Qtde}</Typography>
                                            <Button onClick={() => onAddProduct(contract.ID_Contrato, contract.Cont_Comodato)} sx={{ '@media (max-width: 800px)': { padding: "0px", minWidth: "40px" } }}><Icon sx={{ fontSize: 14, '@media (max-width: 800px)': { fontSize: "20px", padding: "0px" } }}>add_circle</Icon></Button>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{product.Prod_Estoque}</TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>R$ {contract.Cont_ValorTotal.toFixed(2)}</TableCell>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center" }}>
                                            <Button onClick={() => navigate(`/editar-produto/${product.ID_Prod}`)}><Icon sx={{ fontSize: 30 }}>edit</Icon></Button>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center" }}>
                                            <Button onClick={() => openEditContract(contract.ID_Contrato, product.ID_Prod)}><Typography fontSize={'11px'}>Editar Item</Typography></Button>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { padding: "0px" } }}>
                                            <Button onClick={() => onRemoveContract(contract.ID_Contrato, contract.Cont_ID_Prod)} sx={{ '@media (max-width: 800px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                        </TableCell>  
                                    </ProtectedComponent>
                                </TableRow>
                            );
                        })
                    )        
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};