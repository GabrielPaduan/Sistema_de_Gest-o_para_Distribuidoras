import { Box, Button, Typography } from "@mui/material"
import { DefaultHeader, GenericButton, ProtectedComponent } from "../../shared/components"
import { TableProducts } from "../../shared/components"
import { useNavigate } from "react-router-dom";

export const EstoqueProdutos: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <DefaultHeader />
            <Box textAlign={"center"}>
                <Typography variant="h4" paddingTop={10}>Estoque de Produtos</Typography>
            </Box>
            <TableProducts />
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} padding={2}>
                <ProtectedComponent allowedRoles={['1']}>
                    <Box>
                        <Button onClick={() => navigate("/cadastro-produto")} variant="contained" color="primary" sx={{ padding: "15px", width: "100%" }}><Typography variant="h6">Adicionar Produto</Typography></Button>
                    </Box>
                </ProtectedComponent>
                <Box sx={{ '@media (max-width: 800px)': { width: '50%' } }}>
                    <GenericButton name="Voltar" type="button" link="/" />
                </Box>
            </Box>
        </>
    )
}