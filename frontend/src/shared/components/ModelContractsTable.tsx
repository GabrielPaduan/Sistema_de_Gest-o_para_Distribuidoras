import { Button, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ModelosContratoDTO } from "../utils/DTOS"
import { useNavigate } from "react-router-dom";

interface ModelContractsTableProps {
    modelosContrato: ModelosContratoDTO[];
    onRemoveModel: (id: number) => void;
}   

export const ModelContractsTable: React.FC<ModelContractsTableProps> = ({ modelosContrato, onRemoveModel }) => {
    const navigate = useNavigate();

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
                            {modelosContrato.length <= 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Nenhum modelo de contrato encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                            {modelosContrato.map((modelo) => (
                                <TableRow key={modelo.ID_ModeloContrato} hover sx={{ cursor: "pointer" }}>
                                    <TableCell onClick={() => navigate(`/contrato-modelo/${modelo.ID_ModeloContrato}`)}>{modelo.modelCont_Name}</TableCell>
                                    <TableCell onClick={() => navigate(`/contrato-modelo/${modelo.ID_ModeloContrato}`)}>{modelo.modelCont_Descricao}</TableCell>
                                    <TableCell onClick={() => navigate(`/contrato-modelo/${modelo.ID_ModeloContrato}`)}>{new Date(modelo.modelCont_Date).toLocaleDateString()}</TableCell>
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