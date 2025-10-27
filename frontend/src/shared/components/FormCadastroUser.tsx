import Box from "@mui/material/Box";
import { FormField } from "./FormField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { UserInsertDTO } from "../utils/DTOS";
import { cadastrarUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

export const FormCadastroUser: React.FC = () => {
    const navigate = useNavigate();
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const cadastro: UserInsertDTO = {
                usu_nome: formData.get("nome") as string,
                usu_senha: formData.get("senha") as string,
                usu_typeUser: formData.get("typeUser") as unknown as number,
            };
            cadastrarUser(cadastro)
                .then((response) => {
                    navigate("/login");
                })
                .catch((error) => {
                    console.error("Erro ao cadastrar usuário:", error);
                });

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
            onSubmit={submitForm}
            maxWidth={"45%"}
            margin={"auto"}
            gap={2}
        >
            <Box display={"flex"} justifyContent={"space-between"} textAlign={"left"}>
                <Box width={"65%"}>
                    <FormField mTopTxt={2} flex={1} mr={2} width={"75%"} label={"Nome"} name="nome" content="space-evenly" />
                </Box>
                <Box display={"flex"} justifyContent={"space-evenly"} alignItems={"center"} width={"35%"} marginLeft={2}>
                    <Typography variant="h6" width={"50%"}>Tipo de Usuário: </Typography>
                    <Select
                        labelId="type-select-label"
                        id="type-select"
                        label="typeUser"
                        name="typeUser"
                        defaultValue={1}
                        fullWidth
                        sx={{ width: "50%", marginLeft: 0.5 }}
                    >
                        <MenuItem value={1}>Admin</MenuItem>
                        <MenuItem value={2}>Vendedor</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Box display="flex" justifyContent={"space-between"} alignItems="center">
                <Typography component="label" htmlFor={"senha"} width={"15%"} variant="h6" textAlign={"left"}>
                    Senha:
                </Typography>
                <TextField id={"senha"} name={"senha"} type="password" variant="outlined" sx={{ width: "84%" }} />
            </Box>

            <Box textAlign="center">
                <Button type="submit" variant="contained" color="primary">
                    <Typography variant="h6">Cadastrar</Typography>
                </Button>
            </Box>
        </Box>
    );
}