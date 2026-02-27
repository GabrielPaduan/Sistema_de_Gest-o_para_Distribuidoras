import { Box, Typography } from "@mui/material";
import { DefaultHeader, TableHistoricoContract } from "../../shared/components";
import React from "react";

export class HistoricoContratos extends React.Component {
  render() {
    return (
      <>
        <Box textAlign={"center"}>
            <DefaultHeader />
            <Typography variant="h4" paddingTop={10}>Histórico de Contratos</Typography>
            <TableHistoricoContract />
        </Box>
      </>
    );
  }
}                                                       