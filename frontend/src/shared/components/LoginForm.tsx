import Box from "@mui/material/Box"
import { LoginDTO, LoginResponse } from "../utils/DTOS";
import { FormField } from "./FormField";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";

export const LoginForm: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [erro, setErro] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Se o usuário já estiver autenticado, redireciona para a página inicial
        if (isAuthenticated) {
            navigate("/pagina-inicial"); // Ou para a sua rota principal
        }
    }, [isAuthenticated, navigate]);

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
                const formData = new FormData(event.currentTarget);
                const login: LoginDTO = {
                    nome: formData.get("nome") as string,
                    senha: formData.get("senha") as string,
                };
                console.log("Submitting login:", login);
                loginUser(login)
                    .then((response: LoginResponse) => {
                        const token = response.token;
                        console.log("Login successful:", token);
                        localStorage.setItem('authToken', token); // Salva o token
                        
                        navigate("/pagina-inicial");
                        window.location.reload();
                        setErro(false);
                    })
                    .catch((error) => {
                        // window.location.reload();
                        console.log(error)
                        setErro(true);
                        console.error("Login failed:", error);
                    });
            } catch (error) {
                window.location.reload();
                setErro(true);
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
            sx={{ '@media (max-width:600px)': { maxWidth: "90%" } }}
            margin={"auto"}
            gap={2}
        >
            <FormField mTopTxt={2} flex={1} mr={2} width={"75%"} label={"Nome"} name="nome" content="space-evenly" type="text"/>
            <FormField mTopTxt={2} flex={1} mr={2} width={"75%"} label={"Senha"} name="senha" content="space-evenly" type="password" />
            <Box>
                <Button type="submit" variant="contained" color="primary">
                    <Typography variant="h6">Login</Typography>
                </Button>
            </Box>
        </Box>
    );
};