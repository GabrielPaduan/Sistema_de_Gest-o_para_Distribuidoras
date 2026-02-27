import { Box, Typography } from "@mui/material";
import { DefaultHeader } from "../../shared/components";
import React from "react";
import { TelaGerenciarVendas } from "../../shared/components/TelaGerenciarVendas";

export class PaginaVendas extends React.Component {
    render() {
        return (
            <Box>
                <DefaultHeader />
                <TelaGerenciarVendas />
            </Box>
        )
    }
}