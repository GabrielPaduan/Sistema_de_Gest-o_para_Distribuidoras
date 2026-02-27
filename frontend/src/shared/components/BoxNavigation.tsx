import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { GenericButton } from "./GenericButton";
import { useAuth } from "../context";
import { ProtectedComponent } from "./ProtectedComponent";


export const BoxNavigation: React.FC = () => {
  return (
    <>
      <Box width={"100vw"} margin={"auto"} display={"flex"}  justifyContent={"center"} alignItems={"flex-start"} gap={4} paddingTop={10} sx={{ '@media ( min-width: 320px) and (max-width: 800px)': { flexDirection: 'column', alignItems: 'center', gap: 1 } }}>
          <ProtectedComponent allowedRoles={['1', '2']}>
            <Box sx={{ '@media (max-width: 800px)': { width: '90%' } }}>
              <GenericButton name="CLIENTES" type="button" onClick={() => window.location.href = "/visualizar-clientes"} />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1', '2']}>
            <Box sx={{ '@media (max-width: 800px)': { width: '90%' } }}>
              <GenericButton name="MODELO DE CONTRATOS" type="button" onClick={() => window.location.href = "/gerenciar-modelo-contratos"} />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1']}>
            <Box sx={{ '@media (max-width: 800px)': { width: '90%' } }}>
              <GenericButton name="Histórico de Contratos" type="button" onClick={() => window.location.href = "/historico-contratos"} />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1']}>
            <Box sx={{ '@media (max-width: 800px)': { width: '90%' } }}>
              <GenericButton name="Vendas" type="button" onClick={() => window.location.href = "/pagina-vendas"} />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1', '2']}>
            <Box sx={{ '@media (max-width: 800px)': { width: '90%' } }}>
              <GenericButton name="ESTOQUE" type="button" onClick={() => window.location.href = "/estoque-produtos"} />
            </Box>
          </ProtectedComponent>
      </Box>
    </>
  );
}