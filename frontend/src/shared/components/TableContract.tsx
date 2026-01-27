import { Box, Button, Checkbox, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ContractDTO, objectContractExclusion, ProductsCategoriesDTO, TableContractProps } from "../utils/DTOS";
import React, { useEffect, useState } from "react";
import { ProtectedComponent } from "./ProtectedComponent";
import { CheckBox } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Adicione as funções onAdd e onRemove nas props
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

    const sortedContracts = [...contracts].sort((a, b) => {
        const productA = products.find(p => p.ID_Prod === a.Cont_ID_Prod);
        const productB = products.find(p => p.ID_Prod === b.Cont_ID_Prod);
        const prateleiraA = productCategories.find(cat => cat.ID_CategoriaProduto === productA?.Prod_Categoria)?.Cat_Prateleira || 0;
        const prateleiraB = productCategories.find(cat => cat.ID_CategoriaProduto === productB?.Prod_Categoria)?.Cat_Prateleira || 0;
        if (prateleiraA - prateleiraB === 0) {
            return productA?.Prod_CodProduto.localeCompare(productB?.Prod_CodProduto || "") || 0;
        }
        return prateleiraA - prateleiraB;
    });

    return (
        <TableContainer component={Paper} sx={{ margin: "auto", cursor: "default", width: "100%" }}>
            <Table width="100%">
                <TableHead>
                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>
                        Selecionar
                    </TableCell>
                    <TableCell  sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Cmdt</TableCell>
                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Produtos</TableCell>
                    <TableCell  sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Categoria</TableCell>
                    <ProtectedComponent allowedRoles={['1']}>
                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px", display: "none" } }}>Custo Compra</TableCell>
                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px", display: "none" } }}>Porcentagem Lucro</TableCell>
                    </ProtectedComponent>
                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px", display: "none" } }}>Valor Venda</TableCell>
                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Reposição</TableCell>
                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Estoque</TableCell>
                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Valor Total</TableCell>
                    <ProtectedComponent allowedRoles={['1']}>
                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Editar</TableCell>
                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>%</TableCell>
                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Remover</TableCell>
                    </ProtectedComponent>

                </TableHead>
                <TableBody>
                    {
                    sortedContracts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: "center", fontSize: 20 }}>Nenhum contrato cadastrado</TableCell>
                        </TableRow>
                    ) : (
                        
                        sortedContracts.map((contract) => {
                            const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
                            if (!product) return null;
                        
                            return (
                                <TableRow key={contract.ID_Contrato} hover>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>
                                        <Checkbox
                                        checked={selectedItems.some(item => item.contractId === contract.ID_Contrato)}
                                        onChange={() => onToggleSelect(contract.ID_Contrato, product.ID_Prod)}
                                        sx={{ width: '9%', color: 'grey' }}
                                        color="secondary"
                                    />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{contract.Cont_Comodato}</TableCell>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_CodProduto}</TableCell>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_Categoria >= 0 ? productCategories.find(cat => cat.ID_CategoriaProduto === product.Prod_Categoria)?.CatProd_Nome : ''}</TableCell>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", display: "none" } }}>R$ {product.Prod_CustoCompra.toFixed(2)}</TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", display: "none" } }}>{contract.Cont_PorcLucro > 0 ? contract.Cont_PorcLucro : product.Prod_PorcLucro}%</TableCell>
                                    </ProtectedComponent>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", display: "none" } }}>R$ { contract.Cont_PorcLucro > 0 ? (product.Prod_CustoCompra + (product.Prod_CustoCompra * (contract.Cont_PorcLucro / 100))).toFixed(2) : (product.Prod_CustoCompra + (product.Prod_CustoCompra * (product.Prod_PorcLucro / 100))).toFixed(2) || 0}
                                        
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <Button onClick={() => onRemoveProduct(contract.ID_Contrato)} sx={{ '@media (max-width: 800px)': { padding: "0px", minWidth: "40px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { fontSize: "20px", padding: "0px" } }}>remove_circle</Icon></Button>
                                                <Typography sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "0px" } }}>{contract.Cont_Qtde}</Typography>
                                            <Button onClick={() => onAddProduct(contract.ID_Contrato, contract.Cont_Comodato)} sx={{ '@media (max-width: 800px)': { padding: "0px", minWidth: "40px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { fontSize: "20px", padding: "0px" } }}>add_circle</Icon></Button>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_Estoque}</TableCell>
                                    <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>R$ {contract.Cont_ValorTotal.toFixed(2)}</TableCell>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center" }}>
                                            <Button onClick={() => navigate(`/editar-produto/${product.ID_Prod}`)}><Icon sx={{ fontSize: 40 }}>edit</Icon></Button>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center" }}>
                                            <Button onClick={() => openEditContract(contract.ID_Contrato, product.ID_Prod)}>Editar Item</Button>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 800px)': { padding: "0px" } }}>
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