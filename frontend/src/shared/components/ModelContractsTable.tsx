import { Button, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ModelosContratoDTO } from "../utils/DTOS"
import { useState } from "react"

export const ModelContractsTable: React.FC = () => {
    const [modelos, setModelos] = useState<ModelosContratoDTO[]>([])

    const onRemoveModel = (id: number) => {
        // Lógica para remover o modelo de contrato com o ID fornecido
        // Exemplo: setModelos(modelos.filter(modelo => modelo.ID_ModeloContrato !== id));
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ margin: "auto", cursor: "default", width: "100%" }}>
                <Table width={"100%"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Remover</TableCell>
                        </TableRow>   
                    </TableHead>
                    <TableBody>
                            {modelos.length <= 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Nenhum modelo de contrato encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                            {modelos.map((modelo) => (
                                <TableRow key={modelo.ID_ModeloContrato}>
                                    <TableCell>{modelo.modelCont_Name}</TableCell>
                                    <TableCell>{modelo.modelCont_Descricao}</TableCell>
                                    <TableCell>{new Date(modelo.modelCont_Date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                         <Button onClick={() => onRemoveModel(modelo.ID_ModeloContrato)} sx={{ '@media (max-width: 800px)': { padding: "0px" } }}><Icon sx={{ fontSize: 30, '@media (max-width: 800px)': { padding: "0px" } }}>delete_forever</Icon></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}