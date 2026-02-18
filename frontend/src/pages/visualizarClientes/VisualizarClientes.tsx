import { Box, TableCell, Typography } from "@mui/material";
import React from "react";
import { DefaultHeader, GenericButton, ProtectedComponent, TableClients } from "../../shared/components";


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
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={4} paddingBottom={10} sx={{ '@media ( min-width: 320px) and (max-width: 800px)': { flexDirection: 'column', alignItems: 'center', gap: 1 } }}>
              <ProtectedComponent allowedRoles={['1']}>
                  <GenericButton name="Cadastrar Cliente" type="button" link="/cadastro-clientes" />
              </ProtectedComponent>
              <Box >
                <GenericButton name="Voltar" type="button" link="/pagina-inicial" />
              </Box>
            </Box>
          </Box>
        </>
      );
  }
}