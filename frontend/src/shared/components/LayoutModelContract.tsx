import { Box, Button, Checkbox, Icon, Modal, TablePagination, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ModelosContratoDTO, ModelosContratoItensDTO, ModelosContratoItensDTOInsert, objectContractExclusion, ProductDTO, ProductsCategoriesDTO } from "../utils/DTOS";
import { getModelContractById } from "../services/modeloContrato";
import { getAllProducts, searchProductsByName } from "../services/productService";
import { getAllCategories } from "../services/categoriasProdutoService";
import { createModelContractItem, deleteModelContractItem, getModelContractItensById, updateModelContractItem } from "../services/modelContractItens";
import { GenericButton } from "./GenericButton";
import { SearchField } from "./searchField";
import { useDebounce } from "use-debounce";
import { TableContractItens } from "./TableContractItens";
import { set } from "date-fns";
import { useNavigate } from "react-router";


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


interface LayoutModelContractProps {
    id: number;
} 

export const LayoutModelContract: React.FC<LayoutModelContractProps> = ({ id }) => {
    const [modelContract, setModelContract] = useState<ModelosContratoDTO | null>(null);
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [productsContract, setProductsContract] = useState<ProductDTO[]>([]);
    const [modelContractItens, setModelContractItens] = useState<ModelosContratoItensDTO[]>([]);
    const [productCategories, setProductCategories] = useState<ProductsCategoriesDTO[]>([]);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [openEditItem, setOpenEditItem] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [cmdtItem, setCmdtItem] = useState(1);
    const [porcLucro, setPorcLucro] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [selectedItems, setSelectedItems] = useState<objectContractExclusion[]>([]);
    const navigate = useNavigate();


    const handleOpenAddItem = () => setOpenAddItem(true);
    const handleCloseAddItem = () => setOpenAddItem(false);
    const handleOpenEditItem = (id: number) => {
        console.log("Abrindo modal de edição para item de contrato ID:", id);
        setOpenEditItem(true)
        setSelectedProduct(id);
    };
    const handleCloseEditItem = () => { 
         setOpenEditItem(false);
         setSelectedProduct(0);
         setCmdtItem(0);
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleSelect = (contractId: number, productId: number) => {
        const isSelected = selectedItems.some(item => item.contractId === contractId);
        if (isSelected) {
            setSelectedItems(prev => prev.filter(item => item.contractId !== contractId));
        } else {
            setSelectedItems(prev => [...prev, { contractId, productId }]);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Deseja excluir ${selectedItems.length} contratos?`)) return;

        const contractIdsToRemove = selectedItems.map(item => item.contractId);

        setModelContractItens(current => 
            current.filter(c => !contractIdsToRemove.includes(c.ID_ModelosContratoItens))
        );
        const productIdsToRemove = selectedItems.map(item => item.productId);
        setProducts(current => current.filter(p => !productIdsToRemove.includes(p.ID_Prod)));

        try {
            await Promise.all(
                selectedItems.map(item => deleteModelContractItem(item.contractId))
            );
            
            setSelectedItems([]);
        } catch (err) {
            console.error("Erro ao excluir itens em massa:", err);
            alert("Houve um erro ao excluir alguns itens. A página será recarregada.");
            window.location.reload(); 
        }
    };

    const handleRemoveContract = async (contractId: number, productId: number) => {
        setModelContractItens(currentContracts => currentContracts.filter(c => c.ID_ModelosContratoItens !== contractId));
        setProducts(currentProducts => currentProducts.filter(p => p.ID_Prod !== productId));
        try {
            await deleteModelContractItem(contractId);
        } catch (err) {
            console.error("Erro ao remover contrato:", err);
        }
    };

    useEffect(() => {
        const fetchModelContract = async () => {
            try {
                const modelContractData = await getModelContractById(id);
                setModelContract(modelContractData);
                const modelContractItensData = await getModelContractItensById(id);
                setModelContractItens(modelContractItensData);
                const productsData = await getAllProducts();
                setProducts(productsData);
                setProductsContract(productsData.filter(p => modelContractItensData.some(i => i.modelContItens_IDProd === p.ID_Prod)));
                
                const productCategoriesData = await getAllCategories();
                setProductCategories(productCategoriesData);
            } catch (error) {
                console.error("Erro ao buscar modelo de contrato:", error);
            }
        };
        fetchModelContract();
    }, [id]);

    const handleSearch = async (query: string) => {
        if (query.length == 0) {
            await getAllProducts().then(allProducts => setProducts(allProducts));
            return;
        }
        try {
            const response = await searchProductsByName(query);
            setProducts(response);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setProducts([]); 
        }
    };

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const product = products.find(p => p.ID_Prod === selectedProduct);
        
        if (product) {
            setPorcLucro(Number(product.Prod_PorcLucro) || 0); 
        } else {
            setPorcLucro(0); 
        }
    }, [selectedProduct, products]);

    const handleInsertContractItem = async (productId: number, cmdt: number, lucro: number) => {
        if (!modelContract) {
            console.error("Modelo de contrato não carregado.");
            return;
        }
        try {
            const newItem: ModelosContratoItensDTOInsert = {
                modelContItens_IDModelCont: modelContract.ID_ModeloContrato,
                modelContItens_IDProd: productId,
                modelContItens_Comodato: cmdt,
                modelContItens_PorcLucro: lucro,
            };
            const createdItem = await createModelContractItem(newItem);
            setModelContractItens(prev => [...prev, createdItem]);
            setProductsContract(prev => [...prev, products.find(p => p.ID_Prod === productId)!]);
            handleCloseAddItem();
        } catch (error) {
            console.error("Erro ao inserir item de contrato:", error);
        }
    };

    const handleUpdateItem = async (productId: number, newComodato: number, newPorcLucro: number) => {
        const itemToUpdate = modelContractItens.find(c => c.modelContItens_IDProd === productId);
        console.log("Item a ser atualizado:", itemToUpdate);
        if (itemToUpdate) {
            try {
                await updateModelContractItem(itemToUpdate.ID_ModelosContratoItens, newComodato, newPorcLucro);
                setModelContractItens(currentContracts =>
                    currentContracts.map(c => 
                        c.ID_ModelosContratoItens === itemToUpdate.ID_ModelosContratoItens ? { ...c, modelContItens_Comodato: newComodato, modelContItens_PorcLucro: newPorcLucro } : c
                    )
                );
                handleCloseEditItem();
            } catch (err) {
                console.error("Erro ao atualizar o item de contrato:", err);
            }
        }
    };

    return (
        <Box textAlign={"center"} display={"flex"} flexDirection={"column"} gap={4} width={"70%"} margin={"auto"}>
            <Modal
            open={openAddItem}
            onClose={handleCloseAddItem}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, '@media (max-width: 800px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Adicionar Novo Produto
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                    <SearchField onSearchChange={setSearchTerm} />
                    <Box sx={{ maxHeight: "20vh", overflowY: "scroll", marginTop: 2 }}>
                        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                            <Box key={product.ID_Prod} sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, borderBottom: '1px solid #ccc', cursor: 'pointer' }} onClick={() => setSelectedProduct(product.ID_Prod)}>
                                <Checkbox
                                    checked={product.ID_Prod === selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.checked ? product.ID_Prod : 0)}
                                    sx={{ width: '9%', color: 'grey' }}
                                    color="secondary"
                                />
                                <Typography width={"90%"} alignSelf={"center"}>{product.Prod_CodProduto} || R${product.Prod_Valor} || {product.Prod_Categoria >= 0 ? productCategories.find(cat => cat.ID_CategoriaProduto === product.Prod_Categoria)?.CatProd_Nome : 'erro'}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <TablePagination
                        component="div"
                        count={products.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[3, 7, 12]}
                    />
                    <Box display={"flex"} alignItems={"center"} flexDirection={"column"} justifyContent={"space-between"} gap={2} mt={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column" } }}>
                        <Box display={"flex"} justifyContent={"center"} gap={2}>
                            <Box display={"flex"} gap={2} alignItems={"center"} justifyContent={"space-evenly"} width={"40%"} height={"100%"} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                                <Typography component="label" htmlFor={`quantity`} variant="h6" sx={{ '@media (max-width: 800px)': { fontSize: '16px' } }}>
                                    Comodato:
                                </Typography>
                                <TextField
                                    id={`quantity`}
                                    name={`quantity`}
                                    variant="outlined"
                                    value={cmdtItem}
                                    sx={{ width: "100%" }}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setCmdtItem(isNaN(value) ? 1 : value);
                                    }}
                                    inputProps = {{ style: { padding: "8px" } }}
                                />
                            </Box>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}  height={"100%"} gap={2}>
                                <Typography component="label" htmlFor={`quantity`} variant="h6">
                                    % de lucro:
                                </Typography>
                                <TextField
                                    id={`quantity`}
                                    name={`quantity`}
                                    variant="outlined"
                                    value={porcLucro}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setPorcLucro(isNaN(value) ? 0 : value);
                                    }}
                                    inputProps = {{ style: { padding: "8px" } }}
                                />
                            </Box>
                        </Box>
                        <Box width={"100%"} display={"flex"} justifyContent={"center"} height={"100%"} gap={2} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleInsertContractItem(selectedProduct, cmdtItem, porcLucro)}
                            >
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Adicionar Item</Typography>
                            </Button>
                            <Button onClick={handleCloseAddItem} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 800px)': { fontSize: '12px' } }}>Voltar</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openEditItem}
                onClose={handleCloseEditItem}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                            Editar Produto
                        </Typography>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} mt={2}>
                            <Typography id="modal-modal-description" variant="h6">Produto Selecionado: {products.find(p => p.ID_Prod === selectedProduct)?.Prod_CodProduto}</Typography>
                            <Typography id="modal-modal-description" variant="h6">Comodato atual: {modelContractItens.find(c => c.modelContItens_IDProd === selectedProduct)?.modelContItens_Comodato}</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} flexDirection={"column"} gap={2} mt={2}>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} flexDirection={"column"}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}  height={"100%"} gap={2}>
                                    <Typography component="label" htmlFor={`quantity`} variant="h6">
                                        Comodato:
                                    </Typography>
                                    <TextField
                                        id={`quantity`}
                                        name={`quantity`}
                                        variant="outlined"
                                        value={cmdtItem}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setCmdtItem(isNaN(value) ? 1 : value);
                                        }}
                                        inputProps = {{ style: { padding: "8px" } }}
                                    />
                                </Box>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}  height={"100%"} gap={2}>
                                    <Typography component="label" htmlFor={`quantity`} variant="h6">
                                        % de lucro:
                                    </Typography>
                                    <TextField
                                        id={`quantity`}
                                        name={`quantity`}
                                        variant="outlined"
                                        value={porcLucro}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setPorcLucro(isNaN(value) ? 0.1 : value);
                                        }}
                                        inputProps = {{ style: { padding: "8px" } }}
                                    />
                                </Box>
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} height={"100%"} gap={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdateItem(selectedProduct, cmdtItem, porcLucro)}
                                >
                                    <Typography variant="h6" fontSize={16}> Editar</Typography>
                                </Button>
                                <Button onClick={handleCloseEditItem} variant="contained" color="primary">
                                    <Typography variant="h6" fontSize={16}>Voltar</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            {modelContract && (
                <Typography variant="h4" color="text.primary" textAlign={"center"} paddingTop={10} sx={{ "@media (max-width: 800px)": { fontSize: "1.5rem" } }}>
                    {modelContract.modelCont_Name ? modelContract.modelCont_Name : "Sem nome"} 
                </Typography>
            )}
             <Box 
                width={"80%"} 
                margin={"auto"} 
                mb={2} 
                display="flex" 
                justifyContent="flex-end" 
                alignItems="center"
                height="50px" 
            >
                {selectedItems.length > 0 ? (
                    <Box display="flex" alignItems="center" gap={2} bgcolor="#ffebee" p={1} borderRadius={2} width="100%" justifyContent="space-between">
                        <Typography variant="body1" color="error" fontWeight="bold" ml={2}>
                            {selectedItems.length} contrato(s) selecionado(s)
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={handleBulkDelete}
                            startIcon={<Icon>delete</Icon>}
                        >
                            Excluir Selecionados
                        </Button>
                    </Box>
                ) : (
                    // Espaço vazio ou instruções quando nada selecionado
                    <Typography variant="body2" color="text.secondary">
                        Selecione itens na tabela para ações em massa
                    </Typography>
                )}
            </Box>
            <TableContractItens 
                contracts={modelContractItens} 
                productsCategories={productCategories} 
                products={productsContract} 
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onRemoveItem={handleRemoveContract}
                openEditItem={handleOpenEditItem}
            />
            <Box display={"flex"} justifyContent={"center"} gap={2}>
                 <Box>
                    <Button variant="contained" color="primary" sx={{ padding: "15px", width: "100%", '@media (max-width: 800px)': { padding: "15px" } }} onClick={() => handleOpenAddItem()}>
                        <Typography>Adicionar Produto</Typography>
                    </Button>
                 </Box>
                 <GenericButton name="Voltar" type="button" link="" onClick={() => navigate(-1)} />
            </Box>
        </Box>
    );
}