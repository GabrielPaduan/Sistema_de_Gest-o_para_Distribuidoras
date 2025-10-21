import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { GenericButton } from "./GenericButton";
import { useAuth } from "../context";
import { ProtectedComponent } from "./ProtectedComponent";


export const BoxNavigation: React.FC = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <>
      <Box width={"100vw"} margin={"auto"} display={"flex"}  justifyContent={"center"} alignItems={"flex-start"} gap={4} paddingTop={10} sx={{ '@media ( min-width: 320px) and (max-width: 600px)': { flexDirection: 'column', alignItems: 'center', gap: 1 } }}>
          <ProtectedComponent allowedRoles={['1', '2']}>
            <Box sx={{ '@media (max-width: 600px)': { width: '90%' } }}>
              <GenericButton name="CLIENTES" type="button" link="/gerenciar-clientes" />
            </Box>
          </ProtectedComponent>
          <ProtectedComponent allowedRoles={['1']}>
            <Box sx={{ '@media (max-width: 600px)': { width: '90%' } }}>
              <GenericButton name="ESTOQUE" type="button" link="/estoque-produtos" />
            </Box>
          </ProtectedComponent>
      </Box>
    </>
  );
}