import { Box, Button, Checkbox, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { FormField } from "./FormField";
import { GenericButton } from "./GenericButton";
import { useEffect, useState } from "react";
import { ClientDTO, ClientDTOInsert } from "../utils/DTOS";
import { createClient, getClientById, updateClient } from "../services/clientService";
import { create } from "domain";
import { useNavigate, useParams } from "react-router-dom";

export const FormEditarCliente: React.FC = () => {
    let idCliente = parseInt(useParams().id || "0");
    const [client, setClient] = useState<ClientDTOInsert | null>(null);
    const [formData, setFormData] = useState<ClientDTOInsert>({
        cli_razaoSocial: "",
        cli_doc: "",
        cli_typeDoc: 0,
        cli_end: "",
        cli_cep: "",
        cli_email: "",
        cli_bairro: "",
        cli_uf: "",
        cli_insEstadual: "",
        cli_dddTel: "",
        cli_telefone: "",
        cli_dddCel: "",
        cli_celular: "",
        cli_cidade: "",
        cli_endNum: "",
        cli_modelo: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClient = async () => {
            const clientData = await getClientById(idCliente);
            const correctedData = {
                ...clientData,
                cli_typeDoc: Number(clientData.cli_typeDoc || 0) 
            };
            setFormData(correctedData);
        }

        fetchClient();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: Number(value), // Garante que o valor salvo seja sempre um número
        }));
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const newClient: ClientDTO = {
                id: idCliente,
                ...formData,
            };
            setClient(newClient);
            await updateClient(newClient);
            setClient(null);
            navigate("/visualizar-clientes/");
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
                <TextField id="razaoSocial" name="cli_razaoSocial" variant="outlined" placeholder="Digite a razão social" sx={{ width: "50%", '@media (max-width: 800px)': { width: "100%" } }} value={formData?.cli_razaoSocial} onChange={handleChange} />
                <TextField id="inscricaoEstadual" name="cli_insEstadual" variant="outlined" placeholder="Digite a inscrição estadual" sx={{ width: "50%", '@media (max-width: 800px)': { width: "100%" } }} value={formData?.cli_insEstadual} onChange={handleChange} />
            </Box>
            <Box display={"flex"} alignItems={"center"}>
                <TextField id="documentos" name="cli_doc" variant="outlined" placeholder="Digite o documento" sx={{ width: "80%" }} value={formData?.cli_doc} onChange={handleChange} />
                <Box width={"20%"} marginLeft={2}>
                    <Select
                        labelId="doc-select-label"
                        id="doc-select"
                        label="doc"
                        name="cli_typeDoc"
                        value={formData?.cli_typeDoc || 0}
                        onChange={handleSelectChange}
                        fullWidth
                    >
                        <MenuItem value={0}>CPF</MenuItem>
                        <MenuItem value={1}>CNPJ</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"} sx={{ '@media (max-width: 800px)': { flexDirection: "column", gap: 2 } }}>
                    <TextField id="endereco" name="cli_endereco" variant="outlined" placeholder="Digite o endereço" sx={{ width: "50%", '@media (max-width: 800px)': { width: "100%" } }} value={formData?.cli_end} onChange={handleChange} />
                    <Box width="49%" display={"flex"} justifyContent={"space-between"} gap={2} sx={{ '@media (max-width: 800px)': { width: "100%" } }}>
                        <TextField id="endNum" name="cli_endNum" variant="outlined" placeholder="Digite o número" sx={{ width: "35%" }} value={formData?.cli_endNum} onChange={handleChange} />
                        <TextField id="cep" name="cli_cep" variant="outlined" placeholder="Digite o CEP" sx={{ width: "64%" }} value={formData?.cli_cep} onChange={handleChange} />
                    </Box>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="cidade" name="cli_cidade" variant="outlined" placeholder="Digite a cidade" sx={{ width: "50%" }} value={formData?.cli_cidade} onChange={handleChange} />
                    <TextField id="uf" name="cli_uf" variant="outlined" placeholder="UF" sx={{ width: "19%", '@media (max-width: 800px)': { width: "15%" } }} value={formData?.cli_uf} onChange={handleChange} />
                    <TextField id="bairro" name="cli_bairro" variant="outlined" placeholder="Digite o bairro" sx={{ width: "29%" }} value={formData?.cli_bairro} onChange={handleChange} />
                </Box>
            </Box>

            <TextField id="email" name="cli_email" variant="outlined" placeholder="Digite o e-mail" sx={{ width: "100%" }} value={formData?.cli_email} onChange={handleChange} />

            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="dddTel" name="cli_dddTel" variant="outlined" placeholder="DDD" sx={{ width: "9%", '@media (max-width: 800px)': { width: "15%" } }} value={formData?.cli_dddTel} onChange={handleChange} />
                    <TextField id="tel" name="cli_tel" variant="outlined" placeholder="Digite o telefone" sx={{ width: "90%", '@media (max-width: 800px)': { width: "83%" } }} value={formData?.cli_telefone} onChange={handleChange} />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <TextField id="dddCel" name="cli_dddCel" variant="outlined" placeholder="DDD" sx={{ width: "9%", '@media (max-width: 800px)': { width: "15%" } }} value={formData?.cli_dddCel} onChange={handleChange} />
                    <TextField id="cel" name="cli_cel" variant="outlined" placeholder="Digite o celular" sx={{ width: "90%", '@media (max-width: 800px)': { width: "83%" } }} value={formData?.cli_celular} onChange={handleChange} />
                </Box>
            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Box>
                    <Button variant="contained" color="primary" type="submit" sx={{ margin: "10px auto", padding: "15px", '@media (max-width: 800px)': { width: "100%" } }}>
                        <Typography variant="h6" color="text.secondary" sx={{ '@media (max-width: 800px)': { fontSize: "1rem" } }} >
                            Editar
                        </Typography>
                    </Button>
                </Box>
                <Box>
                    <GenericButton name="Voltar" type="button" link="/visualizar-clientes" />
                </Box>
            </Box>
        </Box>
    );
}