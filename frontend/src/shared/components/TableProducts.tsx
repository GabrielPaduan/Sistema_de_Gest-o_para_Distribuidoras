import { useEffect, useState } from "react";
import { getAllProducts, searchProductsByName } from "../services/productService";
import { Box, Button, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { SearchField } from "./searchField";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductDTO } from "../utils/DTOS";
import { useDebounce } from "use-debounce";

export const TableProducts: React.FC = () => {
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

    const filteredProducts = productsData.filter(product =>
        product.Prod_CodProduto.toLowerCase().includes(searchTerm.toLowerCase())
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

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    
    return (
        <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", marginTop: 3, marginBottom: 2, '@media (max-width: 600px)': { maxWidth: "90%" } }}>
            <SearchField onSearchChange={setSearchTerm} />
            <TableContainer component={Paper} sx={{ marginTop: "32px", cursor: "default", width: "100%" }}>
                <Table width="100%">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>Nome</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>Estoque</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>Preço de Custo</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>Preço de Venda</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>Editar</TableCell>
                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>Remover</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: 20 }}>Nenhum produto cadastrado</TableCell>
                                </TableRow>
                            ) : (
                             
                                filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                                        <TableRow key={product.ID_Prod} hover onClick={() => navigate(`/products/${product.ID_Prod}`)} sx={{ cursor: 'pointer' }}>
                                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_CodProduto}</TableCell>
                                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>{product.Prod_Estoque}</TableCell>
                                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>R${product.Prod_CustoCompra}</TableCell>
                                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { fontSize: "15px", padding: "10px" } }}>R${product.Prod_Valor}</TableCell>
                                            <TableCell sx={{ fontSize: 20, textAlign: "center" }}>
                                                <Button><Icon sx={{ fontSize: 40 }}>edit</Icon></Button>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 20, textAlign: "center", '@media (max-width: 600px)': { padding: "0px" } }}>
                                                <Button sx={{ '@media (max-width: 600px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 600px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                            </TableCell>  
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
                    sx={{ '@media (max-width: 600px)': { 
                        '& .MuiTablePagination-selectLabel': {
                            display: 'none'
                        }
                    }}}
                />
            </TableContainer>
        </Box>
    );
};
