import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { GenericButton } from "./GenericButton";
import { ProtectedComponent } from "./ProtectedComponent";


export const BoxNavigationClientes: React.FC = () => {
  return (
    <>
      <Box width={"100vw"} margin={"auto"} display={"flex"}  justifyContent={"center"} alignItems={"flex-start"} gap={4} paddingTop={10} sx={{ '@media ( min-width: 320px) and (max-width: 600px)': { flexDirection: 'column', alignItems: 'center', gap: 1 } }}>
          <ProtectedComponent allowedRoles={['1', '2']}>
            <Box sx={{ '@media (max-width: 600px)': { width: '90%' } }}>
              <GenericButton name="Visualizar Clientes" type="button" link="/visualizar-clientes" />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1']}>
            <Box sx={{ '@media (max-width: 600px)': { width: '90%' } }}>
              <GenericButton name="Cadastrar Cliente" type="button" link="/cadastro-clientes" />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1']}>
            <Box sx={{ '@media (max-width: 600px)': { width: '90%' } }}>
              <GenericButton name="Histórico de Contratos" type="button" link="/historico-contratos" />
            </Box>
          </ProtectedComponent>
          <Box>
            <GenericButton name="Voltar" type="button" link="/" />
          </Box>
      </Box>
    </>
  );
}