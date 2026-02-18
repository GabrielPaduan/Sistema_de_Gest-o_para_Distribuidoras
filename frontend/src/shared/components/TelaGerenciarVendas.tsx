import { Box, Typography } from "@mui/material"
import { TableClients } from "./TableClients"
import { FormVendas } from "./FormVendas"

export const TelaGerenciarVendas: React.FC = () => {
    return (
        <Box>
            <Typography variant="h6" align="center" paddingTop={10}>VENDAS</Typography>
            <FormVendas />
            {/* <TableClients /> */}
        </Box>
    )
}