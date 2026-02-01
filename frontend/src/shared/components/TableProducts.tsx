import { useEffect, useState } from "react";
import { getAllProducts, removeProduct, searchProductsByName } from "../services/productService";
import { Box, Button, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { SearchField } from "./searchField";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductDTO, ProductsCategoriesDTO } from "../utils/DTOS";
import { useDebounce } from "use-debounce";
import { ProtectedComponent } from "./ProtectedComponent";

interface TableProductsProps {
    categorias?: ProductsCategoriesDTO[];
    filteredCategory?: number;
}

export const TableProducts: React.FC<TableProductsProps> = ({ categorias, filteredCategory }) => {
    const [productsData, setProductsData] = React.useState<ProductDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const navigate = useNavigate();
    
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    useEffect (() => {
        const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProductsData(data);

            
        } catch (err: any) {
            console.error(err);
        }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchFilteredCategory = async () => {
            const productsData = await getAllProducts();
            if (filteredCategory === -1) {
                setProductsData(productsData);
                return;
            }
            const filtered = productsData.filter(product => product.Prod_Categoria === filteredCategory);
            setProductsData(filtered);
        }
        fetchFilteredCategory();
    }, [filteredCategory]);

    const filteredProducts = productsData.filter(product =>
        product.Prod_Nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = async (query: string) => {
        if (!query) {
            await setProductsData(await getAllProducts());
            return;
        }
        try {
            const response = await searchProductsByName(query);
            setProductsData(response);
        } catch (error) {
            console.error("Error searching products:", error);
            setProductsData([]);
        }
    }

    async function onRemoveProduct(idProd: number): Promise<void> {
        filteredProducts.splice(filteredProducts.findIndex(product => product.ID_Prod === idProd), 1);
        setProductsData([...filteredProducts]);
        setSearchTerm('');
        await removeProduct(idProd);
    }

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    
    return (
        <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, marginBottom: 2, '@media (max-width: 800px)': { maxWidth: "90%" } }}>
            <SearchField onSearchChange={setSearchTerm} />
            <TableContainer component={Paper} sx={{ marginTop: "32px", cursor: "default", width: "100%" }}>
                <Table width="100%">
                    <TableHead>
                        <TableRow>
                            <ProtectedComponent allowedRoles={['1', '2']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Código</TableCell>
                            </ProtectedComponent>
                            <ProtectedComponent allowedRoles={['1', '2']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Nome</TableCell>
                            </ProtectedComponent>
                            <ProtectedComponent allowedRoles={['1', '2']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Categoria</TableCell>
                            </ProtectedComponent>
                            <ProtectedComponent allowedRoles={['1', '2']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Estoque</TableCell>
                            </ProtectedComponent>
                            <ProtectedComponent allowedRoles={['1']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Preço de Custo</TableCell>
                            </ProtectedComponent>  
                            <ProtectedComponent allowedRoles={['1']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Porcentagem de Lucro</TableCell>
                            </ProtectedComponent>
                                <ProtectedComponent allowedRoles={['1', '2']}>
                            <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Preço de Venda</TableCell>
                                </ProtectedComponent>
                            <ProtectedComponent allowedRoles={['1']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Editar</TableCell>
                            </ProtectedComponent>
                            <ProtectedComponent allowedRoles={['1']}>
                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>Remover</TableCell>
                            </ProtectedComponent>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ textAlign: "center", fontSize: 14 }}>Nenhum produto cadastrado</TableCell>
                                </TableRow>
                            ) : (
                             
                                filteredProducts.sort((a, b) => b.Prod_Categoria - a.Prod_Categoria).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                                        <TableRow key={product.ID_Prod} hover sx={{ cursor: 'pointer' }}>
                                            <ProtectedComponent allowedRoles={['1', '2']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_CodProduto}</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1', '2']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_Nome}</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1', '2']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_Categoria ? categorias?.find(c => c.ID_CategoriaProduto === product.Prod_Categoria)?.CatProd_Nome : "Sem categoria"}</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1', '2']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_Estoque}</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>R${product.Prod_CustoCompra}</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_PorcLucro}%</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1', '2']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { fontSize: "15px", padding: "10px" } }}>R${product.Prod_Valor}</TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center" }}>
                                                    <Button onClick={() => navigate(`/editar-produto/${product.ID_Prod}`)}><Icon sx={{ fontSize: 40 }}>edit</Icon></Button>
                                                </TableCell>
                                            </ProtectedComponent>
                                            <ProtectedComponent allowedRoles={['1']}>
                                                <TableCell sx={{ fontSize: 14, textAlign: "center", '@media (max-width: 800px)': { padding: "0px" } }}>
                                                    <Button onClick={() => onRemoveProduct(product.ID_Prod)} sx={{ '@media (max-width: 800px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                                </TableCell>  
                                            </ProtectedComponent>
                                        </TableRow>
                                    ))
                            )
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredProducts.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 15]}
                    sx={{ '@media (max-width: 800px)': { 
                        '& .MuiTablePagination-selectLabel': {
                            display: 'none'
                        }
                    }}}
                />
            </TableContainer>
        </Box>
    );
};
