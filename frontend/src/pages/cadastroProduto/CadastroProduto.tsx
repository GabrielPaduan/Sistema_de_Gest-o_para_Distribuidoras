import { Box, Typography } from "@mui/material";
import React from "react";
import { DefaultHeader } from "../../shared/components";

export class CadastroProduto extends React.Component {
    render() {
        return (
            <>
                <DefaultHeader />
                <Box textAlign="center" paddingTop={10}>
                    <Typography variant="h4">Cadastro de Produto</Typography>
                    {/* <FormCadastroProduto /> */}
                </Box>
            </>
        );
    }
};
