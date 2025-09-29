import { Box, Button, Modal, TablePagination, TextareaAutosize, TextField, Typography } from "@mui/material";
import { ClientDTO, ContractDTO, ContractDTOInsert, DadosProdutoComodatoDTO, LayoutBaseContratoProps, ProductDTO } from "../utils/DTOS";
import React, { use, useEffect, useState } from "react";
import { TableContract } from "./TableContract";
import { generateReport } from "../utils/Report";
import { getClientById, getModelClients } from "../services/clientService"; // Supondo que você tenha este serviço
import { GenericButton } from "./GenericButton";
import { getAllProducts, getProductByContractId, getProductById, searchProductsByName } from "../services/productService";
import { SearchField } from "./searchField";
import { createContract, getContractByClientId, removeContract, updateContract } from "../services/contractService";
import Checkbox from "@mui/material/Checkbox";
import { createPDFContracts, getPdfByClientId, updatePdf } from "../services/pdfContract";
import { PreviewReport } from "./PreviewReport";
import { useNavigate } from "react-router-dom";
import { useDebounce } from 'use-debounce';

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

export const LayoutBaseContrato: React.FC<LayoutBaseContratoProps> = ({ id }) => {
    const [client, setClient] = useState<ClientDTO | null>(null);
    const [contracts, setContracts] = useState<ContractDTO[]>([]);
    const [contractsInsert, setContractsInsert] = useState<ContractDTOInsert>();
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [productsClient, setProductsClient] = useState<ProductDTO[]>([]);
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cmdt, setCmdt] = useState<number | 1>(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [selectedProduct, setSelectedProduct] = useState<number>(0);
    const [showReport, setShowReport] = useState<boolean>(false);
    const navigate = useNavigate();
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [loading, setLoading] = useState(false);
    const [observation, setObservation] = useState<string>("");
    const [modelosContrato, setModelosContrato] = useState<ClientDTO[]>([]);
    const [selectedModelContract, setSelectedModelContract] = useState<number>(0);
    const [openModelo, setOpenModelo] = useState(false);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setCmdt(1);
        setOpen(false);
    }

    const handleOpenModelo = () => {
        setOpenModelo(true);
    };

    const handleCloseModelo = () => {
        setOpenModelo(false);
    };

    const handleShowReport = () => {
        if (!showReport) {
            setShowReport(true);
        } else {
            setShowReport(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            
            if (id >= 0) {
                try {
                    // Busca dados reais do cliente
                    const clientData = await getClientById(id);
                    setClient(clientData);
                    console.log(clientData)
                    const productData = await getAllProducts();
                    productData.filter(p => p.Prod_Valor > 0);
                    setProducts(productData);
                    console.log(productData)
                    const contractData = await getContractByClientId(id);
                    
                    Array.isArray(contractData) && contractData.forEach(contract => {
                        contract.Cont_Qtde = 0;
                        contract.Cont_ValorTotal = 0;
                    });

                    setContracts(Array.isArray(contractData) ? contractData : [contractData]);
                    

                    const contractsArray = Array.isArray(contractData) ? contractData : [contractData];
                    
                    const productPromises = contractsArray.map(contract => getProductByContractId(contract.ID_Contrato));
                    
                    const productsFromContracts = await Promise.all(productPromises);
                    productsFromContracts.forEach(productData => {
                        if (productData != null) {
                            setProductsClient(prevProducts => [...prevProducts, ...(Array.isArray(productData) ? productData : [productData])]);
                        }
                    });

                    setModelosContrato(await getModelClients());
                } catch (err) {
                    console.error("Erro ao buscar dados:", err);
                }
            }
        };
        fetchData();
    }, []); 

    useEffect(() => {
        try {
            const fetchDataContInsert = async () => {
                const contractData = await getContractByClientId(id);
                setContracts(Array.isArray(contractData) ? contractData : [contractData]);
                if (contractsInsert && contractsInsert.Cont_ID_Prod !== undefined) {
                    const productData = await getProductById(contractsInsert.Cont_ID_Prod);
                    console.log("Produto inserido: ", productData)
                    if (productData != null) {
                        if (productsClient.map(p => p.ID_Prod).includes(productData.ID_Prod)) {
                            setProductsClient(prevProducts => prevProducts.map(p => p.ID_Prod === productData.ID_Prod ? productData : p));
                        } else {
                            setProductsClient(prevProducts => [...prevProducts, ...(Array.isArray(productData) ? productData : [productData])]);
                        }
                    }
                }
            };
            fetchDataContInsert();
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
        }
        
    }, [contractsInsert]);


    const handleGeneratePdf = async () => {
        try {
            for (const contract of contracts) {
                await updateContract(contract.ID_Contrato, contract.Cont_Comodato, contract.Cont_Qtde, contract.Cont_ValorTotal);
            }
            const clientPDF = await getPdfByClientId(id);
            if (clientPDF == null) {
                await createPDFContracts({ PDF_Client_Id: id, PDF_Status: 0, PDF_Generated_Date: new Date().toISOString(), PDF_Observacoes: observation });
            } else {
                await updatePdf(clientPDF.id, {id: clientPDF.id, PDF_Client_Id: clientPDF.PDF_Client_Id, PDF_Status: 0, PDF_Generated_Date: new Date().toISOString(), PDF_Observacoes: observation });
            }
            navigate("/pagina-inicial");
        } catch (err) {
            alert("PDF já criado no sistema!");
            console.error(err);
        }
    };

    useEffect(() => {
        console.log("Contracts updated: ", contracts);
    }, [contracts]);

    const handleAddProduct = (contractId: number, cmdt: number) => {
        setContracts(currentContracts =>
            currentContracts.map(c => {
                const product = productsClient.find(p => p.ID_Prod === c.Cont_ID_Prod);
                if (
                    c.ID_Contrato === contractId &&
                    c.Cont_Qtde < cmdt &&
                    product?.Prod_Estoque !== undefined &&
                    c.Cont_Qtde < product.Prod_Estoque
                ) {
                    const newQuantity = c.Cont_Qtde + 1;
                    // Retorna um NOVO objeto (imutabilidade)
                    return { ...c, Cont_Qtde: newQuantity, Cont_ValorTotal: newQuantity * (product?.Prod_Valor || 0) };
                }
                return c;
            })
        );
    };

    const handleRemoveProduct = (contractId: number) => {
        setContracts(currentContracts =>
            currentContracts.map(c => {
                const product = productsClient.find(p => p.ID_Prod === c.Cont_ID_Prod);
                if (c.ID_Contrato === contractId && c.Cont_Qtde > 0 && product?.Prod_Valor !== undefined) {
                    const newQuantity = c.Cont_Qtde - 1;
                    return { ...c, Cont_Qtde: newQuantity, Cont_ValorTotal: newQuantity * product.Prod_Valor };
                }
                return c;
            })
        );
    };

    const handleRemoveContract = async (contractId: number, productId: number) => {
        setContracts(currentContracts => currentContracts.filter(c => c.ID_Contrato !== contractId));
        setProductsClient(currentProducts => currentProducts.filter(p => p.ID_Prod !== productId));
        try {
            await removeContract(contractId);
        } catch (err) {
            console.error("Erro ao remover contrato:", err);
        }
    };

    const handleInsertContract = async (productId: number, cmdt: number) => {
        const contractExists = contracts.find(c => c.Cont_ID_Prod === productId);

        if (!contractExists || contracts.length === 0) {
                const newContract: ContractDTOInsert = {
                Cont_ID_Cli: client?.id || 0,
                Cont_ID_Prod: productId,
                Cont_Comodato: cmdt,
                Cont_Qtde: 0,
                Cont_ValorTotal: 0.00
            };

            try {
                await createContract(newContract);
                setContractsInsert(newContract);
            } catch(err) {
                console.error("Erro ao criar contrato:", err);
            }          
        } else {
            const updateContractData = { ...contractExists, Cont_Comodato: cmdt };
            
            try {
                await updateContract(updateContractData.ID_Contrato, cmdt, updateContractData.Cont_Qtde, updateContractData.Cont_ValorTotal);
            } catch (err) {
                console.error("Erro ao atualizar contrato:", err);
            }

            setContracts(currentContracts =>
                currentContracts.map(c => {
                    if (c.Cont_ID_Prod === productId) {
                        return { ...c, Cont_Comodato: cmdt };
                    }
                    return c;
                })
            );
        }
        handleClose();
    };


    const handleSearch = async (query: string) => {
        if (query.length == 0) { // Não busca se o termo for muito curto
            await getAllProducts().then(allProducts => setProducts(allProducts));
            return;
        }

        setLoading(true);
        try {
            // Chama nosso novo endpoint no backend
            const response = await searchProductsByName(query);
            setProducts(response);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setProducts([]); // Limpa os resultados em caso de erro
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <Box padding={10} sx={{ "@media (max-width: 600px)": { padding: 2, margin: "auto" } }}>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, '@media (max-width: 600px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Adicionar Novo Produto
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                    {/* <TextField variant="filled"  label="Código do Produto" name="codigoProduto" required placeholder="Digite o código do produto" fullWidth sx={{ marginBottom: 2 }}/> */}
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
                                <Typography width={"90%"}>{product.Prod_CodProduto} || R${product.Prod_Valor}</Typography>
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
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} mt={2} sx={{ '@media (max-width: 600px)': { flexDirection: "column" } }}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"} width={"60%"} height={"100%"} sx={{ '@media (max-width: 600px)': { width: "100%" } }}>
                            <Typography component="label" htmlFor={`quantity`} variant="h6" sx={{ '@media (max-width: 600px)': { fontSize: '16px' } }}>
                                Comodato:
                            </Typography>
                            <TextField
                                id={`quantity`}
                                name={`quantity`}
                                variant="outlined"
                                value={cmdt}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setCmdt(isNaN(value) ? 1 : value);
                                }}
                                inputProps = {{ style: { padding: "8px" } }}
                            />
                        </Box>
                        <Box width={"40%"} display={"flex"} justifyContent={"center"} height={"100%"} gap={1} sx={{ '@media (max-width: 600px)': { width: "100%" } }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleInsertContract(selectedProduct, cmdt)}
                            >
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 600px)': { fontSize: '12px' } }}> Adicionar</Typography>
                            </Button>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 600px)': { fontSize: '12px' } }}>Voltar</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>


            {/* Modal Referente ao modelo de Contrato */}
            <Modal
            open={openModelo}
            onClose={handleCloseModelo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, '@media (max-width: 600px)': { width: "80%" } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Modelos de Contrato
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />

                    <Box sx={{ maxHeight: "20vh", overflowY: "scroll", marginTop: 2 }}>
                        {modelosContrato.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((modelContract) => (
                            <Box key={modelContract.id} sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, borderBottom: '1px solid #ccc', cursor: 'pointer' }} onClick={() => setSelectedProduct(modelContract.id)}>

                                <Typography width={"90%"} alignSelf={"center"}>{modelContract.cli_razaoSocial}</Typography>
                                <Checkbox
                                    checked={modelContract.id === selectedModelContract}
                                    onChange={(e) => setSelectedModelContract(e.target.checked ? modelContract.id : 0)}
                                    sx={{ width: '9%', color: 'grey' }}
                                    color="secondary"
                                />
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
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2} mt={2} sx={{ '@media (max-width: 600px)': { flexDirection: "column" } }}>
                        <Box width={"100%"} display={"flex"} justifyContent={"space-evenly"} height={"100%"} gap={1} sx={{ '@media (max-width: 600px)': { width: "100%" } }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleInsertContract(selectedProduct, cmdt)}
                            >
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 600px)': { fontSize: '12px' } }}> Confirmar</Typography>
                            </Button>
                            <Button onClick={handleCloseModelo} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={16} sx={{ '@media (max-width: 600px)': { fontSize: '12px' } }}>Fechar</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>


            {/* <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
                        Editar Produto
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />
                    <Box sx={{ maxHeight: "20vh", overflowY: "scroll", marginTop: 2 }}>
                        <Typography>Valor do novo comodato:</Typography>
                        <TextField variant="outlined" value={cmdt} onChange={(e) => setCmdt(Number(e.target.value))} />
                    </Box>
                    <TablePagination
                        component="div"
                        count={filteredProduct.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15]}
                    />
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} gap={2}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"} width={"60%"} height={"100%"}>
                            <Typography component="label" htmlFor={`quantity`} variant="h6">
                                Comodato:
                            </Typography>
                            <TextField
                                id={`quantity`}
                                name={`quantity`}
                                variant="outlined"
                                value={cmdt}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setCmdt(isNaN(value) ? 1 : value);
                                }}
                                inputProps = {{ style: { padding: "8px" } }}
                            />
                        </Box>
                        <Box width={"40%"} display={"flex"} justifyContent={"center"} height={"100%"} gap={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleInsertContract(selectedProduct, cmdt)}
                            >
                                <Typography variant="h6" fontSize={16}> Adicionar</Typography>
                            </Button>
                            <Button onClick={handleClose} variant="contained" color="primary">
                                <Typography variant="h6" fontSize={16}>Voltar</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal> */}
            <Typography variant="h4" color="text.primary" textAlign={"center"} paddingTop={10} sx={{ "@media (max-width: 600px)": { fontSize: "1.5rem" } }}>
                        {client?.cli_razaoSocial ? `Contrato de ${client.cli_razaoSocial}` : "Carregando Contrato..."}
            </Typography>
            {!showReport && (
                <Box width={"70%"} margin={"auto"} sx={{ "@media (max-width: 600px)": { width: "95%" } }}>
                    <TableContract
                        client={client}
                        contracts={contracts}
                        products={productsClient}
                        onAddProduct={handleAddProduct}    
                        onRemoveProduct={handleRemoveProduct}
                        onRemoveContract={handleRemoveContract}
                    />

                    <Box>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Digite observações aqui..."
                            style={{ width: '98%', padding: '8px', marginTop: "32px", fontSize: "20px", fontFamily: "Arial", borderRadius: "4px" }}
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                    </Box>

                    <Box display={"flex"} alignItems="center" justifyContent="center" gap={2} mt={4} sx={{ '@media (max-width: 600px)': { flexDirection: "column" } }}>
                        <Box sx={{width: "25%", '@media (max-width: 600px)': { width: '100%' } }}>
                            <Button variant="contained" color="primary" sx={{ padding: "15px", width: "100%", '@media (max-width: 600px)': { padding: "15px" } }} onClick={handleOpen}>
                                <Typography variant="h6" sx={{ '@media (max-width: 600px)': { fontSize: "1rem" } }}>Adicionar Produto</Typography>
                            </Button>
                        </Box>
                        <Box sx={{width: "25%", '@media (max-width: 600px)': { width: '100%' } }}>
                            <Button onClick={handleOpenModelo} variant="contained" color="primary" sx={{ padding: "15px", width: "100%", '@media (max-width: 600px)': { padding: "15px" } }}>
                                <Typography variant="h6" sx={{ '@media (max-width: 600px)': { fontSize: "1rem" } }}>Modelos Contrato</Typography>
                            </Button>
                        </Box>
                        <Box sx={{width: "25%", '@media (max-width: 600px)': { width: '100%' } }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ padding: "15px", width: "100%" }}
                                disabled={!client}
                                onClick={() => handleShowReport()}
                            >
                                <Typography variant="h6" sx={{ '@media (max-width: 600px)': { fontSize: "1rem" } }}>Prévia Relatório</Typography>
                            </Button>
                        </Box>
                        <Box sx={{ width: "25%", '@media (max-width: 600px)': { width: '100%' } }}>
                            <GenericButton name="Voltar" type="button" link="/visualizar-clientes" />
                        </Box>
                    </Box>
                </Box>
            )}
            {showReport && client && (
                <Box>
                    <PreviewReport client={client} contracts={contracts} products={productsClient} />

                    <Box display={"flex"} justifyContent={"space-evenly"} sx={{ textAlign: 'center', my: 4, '@media (max-width: 600px)': { flexDirection: 'column', gap: 2 } }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ padding: "15px" }}
                            onClick={() => handleShowReport()}
                            disabled={!client}

                        >
                            <Typography variant="h6" sx={{ '@media (max-width: 600px)': { fontSize: "15px" } }}>Ocultar Relatório</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ padding: "15px" }}
                            onClick={() => handleGeneratePdf()}
                        >
                            <Typography variant="h6" sx={{ '@media (max-width: 600px)': { fontSize: "15px" } }}>Enviar Relatório</Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};