import { Box, Button, Typography } from "@mui/material"
import { GenericButton } from "./GenericButton"
import { ProtectedComponent } from "./ProtectedComponent"

export const BoxNavigationModeloContrato: React.FC = () => {
    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={4} paddingTop={10} margin={"auto"}>
            <ProtectedComponent allowedRoles={['1', '2']}>
                <Box sx={{ '@media (max-width: 800px)': { width: '90%' } }}>
                    <GenericButton name="Visualizar Modelos" type="button" link="/visualizar-modelos" />
                </Box>
            </ProtectedComponent>
            <ProtectedComponent allowedRoles={['1']}>
                <Box sx={{'@media (max-width: 800px)': { width: '90%' } }}>
                    <GenericButton name="Cadastrar Modelo" type="button" link="/cadastro-modelos" />
                </Box>
            </ProtectedComponent>
            <Box>
                <GenericButton name="Voltar" type="button" link="/" />
            </Box>

        </Box>
    )
}