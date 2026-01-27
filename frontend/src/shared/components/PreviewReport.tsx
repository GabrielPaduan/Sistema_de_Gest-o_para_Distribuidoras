// src/components/RelatorioPreview.tsx
import {
    Box,
    Button,
    Container,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { ClientDTO, ContractDTO, ProductDTO, ProductsCategoriesDTO, SnapshotProductDTO } from "../utils/DTOS";
import logo from '../assets/logo_empresa.png';

interface RelatorioPreviewProps {
    client: ClientDTO;
    contracts: ContractDTO[];
    products: ProductDTO[];
    snapshotProducts?: SnapshotProductDTO[];
    productCategories: ProductsCategoriesDTO[];
}
export const PreviewReport: React.FC<RelatorioPreviewProps> = ({ client, contracts, products, snapshotProducts, productCategories }) => {
    const theme = useTheme();
    let valorTotalGeral = 0;
    if(snapshotProducts == undefined) {
        valorTotalGeral = contracts.reduce((sum, contract) => {
            const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
            return sum + ((contract.Cont_Qtde ?? 0) * (product?.Prod_Valor ?? 0));
        }, 0);
    } else {
        valorTotalGeral = snapshotProducts.reduce((sum, snapshot) => {
            return sum + (snapshot.snapshot_valor_total_item ?? 0);
        }, 0);
    }

    snapshotProducts?.sort((a, b) => {
        return b.snapshot_prod_cat - a.snapshot_prod_cat;
    })

    contracts.sort((a, b) => {
        const productA = products.find(p => p.ID_Prod === a.Cont_ID_Prod);
        const productB = products.find(p => p.ID_Prod === b.Cont_ID_Prod);
        const prateleiraA = productCategories.find(cat => cat.ID_CategoriaProduto === productA?.Prod_Categoria)?.Cat_Prateleira || 0;
        const prateleiraB = productCategories.find(cat => cat.ID_CategoriaProduto === productB?.Prod_Categoria)?.Cat_Prateleira || 0;
        if (prateleiraA - prateleiraB === 0) {
            return productA?.Prod_CodProduto.localeCompare(productB?.Prod_CodProduto || "") || 0;
        }
        return prateleiraA - prateleiraB;
    });

    const SPLIT_THRESHOLD = 10; 
    const shouldSplit = contracts.length > SPLIT_THRESHOLD;

    const midpoint = Math.ceil(contracts.length / 2);
    const firstHalfContracts = shouldSplit ? contracts.slice(0, midpoint) : contracts;
    const secondHalfContracts = shouldSplit ? contracts.slice(midpoint) : [];

    const ProductTable: React.FC<{ contractList: ContractDTO[] }> = ({ contractList }) => (

        <TableContainer component={Paper} variant="outlined" sx={{ height: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                        <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>CMDT</TableCell>
                        <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>PRODUTOS</TableCell>
                        <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>CATEGORIA</TableCell>
                        <TableCell align="right" sx={{ color: 'common.white', fontWeight: 'bold', '@media (max-width: 800px)': { display: 'none' } }}>VALOR UNIT.</TableCell>
                        <TableCell align="center" sx={{ color: 'common.white', fontWeight: 'bold' }}>QTD</TableCell>
                        <TableCell align="right" sx={{ color: 'common.white', fontWeight: 'bold' }}>VALOR TOTAL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {snapshotProducts == undefined ? contractList.map(contract => {
                        const product = products.find(p => p.ID_Prod === contract.Cont_ID_Prod);
                        const valorTotal = (contract.Cont_Qtde ?? 0) * (product?.Prod_Valor ?? 0);
                        return (
                            <TableRow key={contract.ID_Contrato} sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                                <TableCell align="center">{ contract.Cont_Comodato}</TableCell>
                                <TableCell>{product?.Prod_CodProduto || 'Produto não encontrado'}</TableCell>
                                <TableCell>{productCategories.find(cat => cat.ID_CategoriaProduto === product?.Prod_Categoria)?.CatProd_Nome}</TableCell>
                                <TableCell align="right" sx={{ '@media (max-width: 800px)': { display: 'none' } }}>R$ {product?.Prod_Valor?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell align="center">{contract.Cont_Qtde || 0}</TableCell>
                                <TableCell align="right">R$ {valorTotal.toFixed(2)}</TableCell>
                            </TableRow>
                        );
                    }) : snapshotProducts?.map(snapshot => {
                        return (    
                            <TableRow key={snapshot.ID_ContPDFItens} sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                                <TableCell align="center">{ snapshot.snapshot_comodato}</TableCell>
                                <TableCell>{snapshot.snapshot_prod_cod || 'Produto não encontrado'}</TableCell>
                                <TableCell>{productCategories.find(cat => cat.ID_CategoriaProduto === snapshot.snapshot_prod_cat)?.CatProd_Nome}</TableCell>
                                <TableCell align="right" sx={{ '@media (max-width: 800px)': { display: 'none' } }}>R$ {snapshot.snapshot_valor_unitario?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell align="center">{snapshot.snapshot_qtde || 0}</TableCell>
                                <TableCell align="right">R$ {snapshot.snapshot_valor_total_item?.toFixed(2) || '0.00'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Container sx={{ width: '100%', my: 4, p: { xs: 0 } }}>
            <Paper elevation={3} sx={{ width: '100%', margin: 'auto', p: { xs: 1, md: 4 } }}>
                <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, p: {xs: 0} }}>
                    <Grid sx={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">CLIENTE</Typography>
                        <Typography variant="h6" component="h1" gutterBottom>
                            {client.cli_razaoSocial || "Não informado"}
                        </Typography>
                        <Typography variant="body2">{client.cli_end || "Endereço não informado"}</Typography>
                        <Typography variant="body2">{client.cli_cidade ? `${client.cli_cidade} ${client.cli_uf}` : "Cidade não informada"}</Typography>
                        <Typography variant="body2">{client.cli_email || "Email não informado"}</Typography>
                    </Grid>
                    <Grid sx={{ xs: 12, md: 6, textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
                        <Box component="img" src={logo} alt="Logo O Rei do Óleo" sx={{ width: 100, mb: 1 }} />
                        <Typography variant="h6">O REI DO ÓLEO</Typography>
                        <Typography variant="body2">reidooleodistribuidora@gmail.com</Typography>
                        <Typography variant="body2">(43) 98488-0539</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* TÍTULO */}
                <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    INFORMAÇÕES DO CONTRATO
                </Typography>

                {/* TABELA DE PRODUTOS */}
                <Box sx={{ my: 4 }}>
                    {!shouldSplit && (
                        // 1. Renderiza UMA tabela se a lista for CURTA
                        <ProductTable contractList={firstHalfContracts} />
                    )}

                    {shouldSplit && (
                        // 2. Renderiza DUAS tabelas lado a lado se a lista for LONGA
                        <Box display="flex" width="100%" gap={2}>
                            <Box width="50%">
                                <ProductTable contractList={firstHalfContracts} />
                            </Box>
                            <Box width="50%">
                                <ProductTable contractList={secondHalfContracts} />
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* RODAPÉ E TOTAL */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4 }}>
                    <Box>
                        <Typography variant="body2"><strong>Responsável:</strong> Tiago Cernev Neves</Typography>
                        <Typography variant="body2"><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" color="text.secondary">Valor Total do Contrato:</Typography>
                        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
                            R$ {valorTotalGeral.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};