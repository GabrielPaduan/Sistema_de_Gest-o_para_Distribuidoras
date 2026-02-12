import { Box, Button, Checkbox, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ContractDTO, ModelosContratoItensDTO, objectContractExclusion, ProductDTO, ProductsCategoriesDTO } from "../utils/DTOS"
import { ProtectedComponent } from "./ProtectedComponent";
import { useNavigate } from "react-router-dom";

interface TableContractItensProps {
    contracts: ModelosContratoItensDTO[];
    productsCategories: ProductsCategoriesDTO[];
    products: ProductDTO[];
    selectedItems: objectContractExclusion[]; 
    onToggleSelect: (contractId: number, productId: number) => void;
    onRemoveItem: (contractId: number, productId: number) => void;
    openEditItem: (productId: number) => void;
}

export const TableContractItens: React.FC<TableContractItensProps> = ({ contracts, productsCategories, products, selectedItems, onToggleSelect, onRemoveItem, openEditItem }) => {
    const navigate = useNavigate();
    const sortedContracts = [...contracts].sort((a, b) => {
        const productA = products.find(p => p.ID_Prod === a.modelContItens_IDProd);
        const productB = products.find(p => p.ID_Prod === b.modelContItens_IDProd);
        const prateleiraA = productsCategories.find(cat => cat.ID_CategoriaProduto === productA?.Prod_Categoria)?.Cat_Prateleira || 0;
        const prateleiraB = productsCategories.find(cat => cat.ID_CategoriaProduto === productB?.Prod_Categoria)?.Cat_Prateleira || 0;
        if (prateleiraA - prateleiraB === 0) {
            return productA?.Prod_CodProduto.localeCompare(productB?.Prod_CodProduto || "") || 0;
        }
        return prateleiraA - prateleiraB;
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
                    <TableCell sx={{ fontSize: 14, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Estoque</TableCell>
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
                            const product = products.find(p => p.ID_Prod === contract.modelContItens_IDProd);
                            if (!product) return null;
                        
                            return (
                                <TableRow key={contract.ID_ModelosContratoItens} hover>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>
                                            <Checkbox
                                            checked={selectedItems.some(item => item.contractId === contract.ID_ModelosContratoItens)}
                                            onChange={() => onToggleSelect(contract.ID_ModelosContratoItens, product.ID_Prod)}
                                            sx={{ width: '9%', color: 'grey' }}
                                            color="secondary"
                                        /></TableCell>
                                    </ProtectedComponent>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{contract.modelContItens_Comodato}</TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{product.Prod_CodProduto}</TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{product.Prod_Categoria >= 0 ? productsCategories.find(cat => cat.ID_CategoriaProduto === product.Prod_Categoria)?.CatProd_Nome : ''}</TableCell>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", display: "none" } }}>R$ {product.Prod_CustoCompra.toFixed(2)}</TableCell>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", display: "none" } }}>{contract.modelContItens_PorcLucro > 0 ? contract.modelContItens_PorcLucro : product.Prod_PorcLucro}%</TableCell>
                                    </ProtectedComponent>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", display: "none" } }}>R$ { contract.modelContItens_PorcLucro > 0 ? (product.Prod_CustoCompra + (product.Prod_CustoCompra * (contract.modelContItens_PorcLucro / 100))).toFixed(2) : (product.Prod_CustoCompra + (product.Prod_CustoCompra * (product.Prod_PorcLucro / 100))).toFixed(2) || 0}
                                        
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { fontSize: "11px", padding: "10px" } }}>{product.Prod_Estoque}</TableCell>
                                    <ProtectedComponent allowedRoles={['1']}>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center" }}>
                                            <Button onClick={() => navigate(`/editar-produto/${product.ID_Prod}`)}><Icon sx={{ fontSize: 30 }}>edit</Icon></Button>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center" }}>
                                            <Button onClick={() => {openEditItem(product.ID_Prod)}}><Typography fontSize={'11px'}>Editar Item</Typography></Button>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12, padding: 0, textAlign: "center", '@media (max-width: 800px)': { padding: "0px" } }}>
                                            <Button onClick={() => onRemoveItem(contract.ID_ModelosContratoItens, contract.modelContItens_IDProd)} sx={{ '@media (max-width: 800px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { padding: "0px" } }}>delete_forever</Icon></Button>
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
}