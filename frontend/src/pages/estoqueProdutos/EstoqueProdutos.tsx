import { Box, Typography } from "@mui/material"
import { DefaultHeader, TelaEstoque} from "../../shared/components"


export const EstoqueProdutos: React.FC = () => {

    return (
        <>
            <DefaultHeader />
            <Box textAlign={"center"}>
                <Typography variant="h4" paddingTop={10}>Estoque de Produtos</Typography>
            </Box>
            <TelaEstoque />
        </>
    )
}