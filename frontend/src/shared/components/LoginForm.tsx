import Box from "@mui/material/Box"
import { LoginDTO, LoginResponse } from "../utils/DTOS";
import { FormField } from "./FormField";
import { Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";

export const LoginForm: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [erro, setErro] = useState<number>(0);
    const navigate = useNavigate();
    const { login } = useAuth();

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
                const loginData: LoginDTO = {
                    nome: formData.get("nome") as string,
                    senha: formData.get("senha") as string,
                };
                if (!loginData.nome || !loginData.senha) {
                    setErro(1);
                    return;
                }

                loginUser(loginData)
                    .then((response: LoginResponse) => {
                        const token = response.token;
                        login(token);
                        
                        navigate("/pagina-inicial");
                        window.location.reload();
                        setErro(0);
                    })
                    .catch((error) => {
                        console.log(error)
                        setErro(2);
                        console.error("Login failed:", error);
                    });
            } catch (error) {
                window.location.reload();
                setErro(3);
                console.error("Error submitting form:", error);
            }
        };

    return (
        <>
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
                <FormField mTopTxt={2} flex={1} mr={2} width={"75%"} label={"Nome"} name="nome" content="space-evenly" type="text" required/>
                <FormField mTopTxt={2} flex={1} mr={2} width={"75%"} label={"Senha"} name="senha" content="space-evenly" type="password" required/>
                {erro === 1 && (
                    <Typography color="error" variant="body2">
                        Os campos devem estar preenchidos. Tente novamente.
                    </Typography>
                )}
                {erro === 2 && (
                    <Typography color="error" variant="body2">
                        Nome ou senha incorretos. Tente novamente.
                    </Typography>
                )}
                <Box>
                    <Button type="submit" variant="contained" color="primary">
                        <Typography variant="h6">Login</Typography>
                    </Button>
                </Box>
            </Box>
        </>
    );
};