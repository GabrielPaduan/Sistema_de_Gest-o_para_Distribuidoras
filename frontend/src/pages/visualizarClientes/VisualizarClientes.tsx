import { Box, TableCell, Typography } from "@mui/material";
import React from "react";
import { DefaultHeader, GenericButton, TableClients } from "../../shared/components";


export class VisualizarClientes extends React.Component {
  render() {
      return (
        <>  
          <DefaultHeader />
          <Box textAlign={"center"}>
            <Typography variant="h4" color="text.primary" textAlign={"center"} paddingTop={10}>
              Listagem de Clientes
            </Typography>
            <TableClients />
            <Box sx={{ width: '10%', '@media (max-width: 600px)': { width: '90%' }, margin: "auto" }}>
              <GenericButton name="Voltar" type="button" link="/gerenciar-clientes" />
            </Box>
          </Box>
        </>
      );
  }
}