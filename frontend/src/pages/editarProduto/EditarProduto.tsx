import { Box, Typography } from "@mui/material";
import React from "react";
import { DefaultHeader, FormEditarProduto } from "../../shared/components";
import { useParams } from "react-router-dom";

export class EditarProduto extends React.Component {
    render() {
        return (
            <>
                <DefaultHeader />
                <Box textAlign="center" paddingTop={10}>
                    <Typography variant="h4">Editar Produto</Typography>
                    <FormEditarProduto/>
                </Box>
            </>
        );
    }
};