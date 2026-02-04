import { Box, Button, Checkbox, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FormField } from "./FormField";
import { GenericButton } from "./GenericButton";
import { useState } from "react";
import { ClientDTOInsert } from "../utils/DTOS";
import { createClient } from "../services/clientService";
import { create } from "domain";
import { useNavigate } from "react-router-dom";

export const Form: React.FC = () => {
    const [client, setClient] = useState<ClientDTOInsert | null>(null);
    const [isChecked, setIsChecked] = useState<number>(0);
    const navigate = useNavigate();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Atualize o estado: 1 se estiver marcado, 0 se não estiver
        setIsChecked(event.target.checked ? 1 : 0);
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const newClient: ClientDTOInsert = {
                cli_razaoSocial: formData.get("razaoSocial") as string,
                cli_doc: formData.get("documentos") as string,
                cli_typeDoc: formData.get("docType") as unknown as number,
                cli_end: formData.get("endereco") as string,
                cli_cep: formData.get("cep") as string,
                cli_email: formData.get("email") as string,
                cli_bairro: formData.get("bairro") as string,
                cli_uf: formData.get("uf") as string,
                cli_insEstadual: formData.get("inscricaoEstadual") as string,
                cli_dddTel: formData.get("dddTel") as string,
                cli_telefone: formData.get("tel") as string,
                cli_dddCel: formData.get("dddCel") as string,
                cli_cidade: formData.get("cidade") as string,
                cli_celular: formData.get("cel") as string,
                cli_endNum: formData.get("endNum") as string,
                cli_responsavel: formData.get("responsavel") as string,
                cli_modelo: isChecked,
            };
            setClient(newClient);
            const idCliente = await createClient(newClient);
            setClient(null);
            navigate(`/contrato-cliente/${idCliente[0].id}`);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            padding={4}
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={"70%"}
            sx={{ '@media (max-width: 800px)': { maxWidth: "95%", padding: "10px" } }}
            margin="auto"
            onSubmit={submitForm}
        >
            <Box display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column" } }}>
                <TextField id="razaoSocial" name="razaoSocial" variant="outlined" placeholder="Digite a razão social" sx={{ width: "50%", '@media (max-width: 800px)': { width: "100%" } }} />
                <TextField id="inscricaoEstadual" name="inscricaoEstadual" variant="outlined" placeholder="Digite a inscrição estadual" sx={{ width: "50%", '@media (max-width: 800px)': { width: "100%" } }} />
            </Box>
            <Box display={"flex"} alignItems={"center"}>
                <TextField id="documentos" name="documentos" variant="outlined" placeholder="Digite o documento" sx={{ width: "80%" }} />
                <Box width={"20%"} marginLeft={2}>
                    <Select
                        labelId="doc-select-label"
                        id="doc-select"
                        label="doc"
                        name="docType"
                        defaultValue={0}
                        fullWidth
                    >
                        <MenuItem value={0}>CPF</MenuItem>
                        <MenuItem value={1}>CNPJ</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                    <TextField id="endereco" name="endereco" variant="outlined" placeholder="Digite o endereço" sx={{ width: "50%", '@media (max-width: 800px)': { width: "100%" } }} />
                    <Box width="49%" display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                        <TextField id="endNum" name="endNum" variant="outlined" placeholder="Digite o número" sx={{ width: "35%" }} />
                        <TextField id="cep" name="cep" variant="outlined" placeholder="Digite o CEP" sx={{ width: "64%" }} />
                    </Box>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="cidade" name="cidade" variant="outlined" placeholder="Digite a cidade" sx={{ width: "50%" }} />
                    <TextField id="uf" name="uf" variant="outlined" placeholder="UF" sx={{ width: "19%", '@media (max-width: 800px)': { width: "15%" } }} />
                    <TextField id="bairro" name="bairro" variant="outlined" placeholder="Digite o bairro" sx={{ width: "29%" }} />
                </Box>
            </Box>

            <TextField id="email" name="email" variant="outlined" placeholder="Digite o e-mail" sx={{ width: "100%" }} />

            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="dddTel" name="dddTel" variant="outlined" placeholder="DDD" sx={{ width: "9%", '@media (max-width: 800px)': { width: "15%" } }} />
                    <TextField id="tel" name="tel" variant="outlined" placeholder="Digite o telefone" sx={{ width: "90%", '@media (max-width: 800px)': { width: "83%" } }} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="dddCel" name="dddCel" variant="outlined" placeholder="DDD" sx={{ width: "9%", '@media (max-width: 800px)': { width: "15%" } }} />
                    <TextField id="cel" name="cel" variant="outlined" placeholder="Digite o celular" sx={{ width: "90%", '@media (max-width: 800px)': { width: "83%" } }} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="responsavel" name="responsavel" variant="outlined" placeholder="Digite o responsável" sx={{ width: "100%", '@media (max-width: 800px)': { width: "83%" } }} />
                </Box>
            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} sx={{ '@media (max-width: 800px)': { flexDirection: "column" } }}>
                <Typography variant="h6" textAlign={"center"}>Selecione essa opção caso queira definir esse cliente como modelo de contrato: </Typography>
                <Checkbox id="modelo" name="modelo" style={{ color: "black" }} checked={isChecked === 1} // Use o estado para controlar a propriedade 'checked'
                    onChange={handleCheckboxChange}/>
            </Box>


            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Box>
                    <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 800px)': { width: "100%" } }}>
                        <Typography variant="h6" fontSize={14} color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }} >
                            Cadastrar
                        </Typography>
                    </Button>
                </Box>
                <Box>
                    <GenericButton name="Voltar" type="button" link="/gerenciar-clientes" />
                </Box>
            </Box>
        </Box>
    );
}