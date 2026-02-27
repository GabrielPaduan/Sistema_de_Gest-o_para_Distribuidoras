import { Box, TableCell, Typography } from "@mui/material";
import React from "react";
import { DefaultHeader, GenericButton, ProtectedComponent, TableClients } from "../../shared/components";
import { useNavigate } from "react-router/dist/lib/hooks";


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
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} margin={"auto"} gap={4} paddingBottom={10} width={"70%"} sx={{ '@media ( min-width: 320px) and (max-width: 800px)': { flexDirection: 'column', alignItems: 'center', gap: 1 } }}>
              <ProtectedComponent allowedRoles={['1']}>
                  <GenericButton name="Cadastrar Cliente" type="button" onClick = {() => window.location.href = "/cadastro-clientes"} />
              </ProtectedComponent>
              <GenericButton name="Voltar" type="button" onClick={() => window.location.href = "/pagina-inicial"} />
            </Box>
          </Box>
        </>
      );
  }
}