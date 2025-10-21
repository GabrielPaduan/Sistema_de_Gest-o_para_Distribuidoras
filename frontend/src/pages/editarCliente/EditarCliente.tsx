import { Box, Typography } from "@mui/material";
import React from "react";
import { DefaultHeader, FormEditarCliente, GenericButton } from "../../shared/components";

export class EditarCliente extends React.Component {
    render() {
        return (
            <>
                <DefaultHeader />
                <Box textAlign="center" paddingTop={10}>
                    <Typography variant="h4">Editar Cliente</Typography>
                    <FormEditarCliente />
                </Box>
            </>
        );
    }
}