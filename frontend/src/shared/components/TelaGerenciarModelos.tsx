import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { ModelContractsTable } from "./ModelContractsTable"
import { GenericButton } from "./GenericButton"
import { useEffect, useState } from "react";
import { text } from "stream/consumers";
import { ModelosContratoDTO } from "../utils/DTOS";
import { createModelContract, deleteModelContract, getAllModelContracts } from "../services/modeloContrato";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  width: { xs: "90%", md: 400 },
  p: 4,
};

export const TelaGerenciarModelos: React.FC = () => {
    const [modalCreateModelo, setModalCreateModelo] = useState(false);
    const [modelosContrato, setModelosContrato] = useState<ModelosContratoDTO[]>([]);
    const [newModeloContrato, setNewModeloContrato] = useState({
        ID_ModeloContrato: 0,
        modelCont_Name: "",
        modelCont_Descricao: "",
        modelCont_Date: new Date().toISOString(),
    });

    useEffect(() => {
        const fetchModelosContrato = async () => {
            try {
                const data = await getAllModelContracts();
                setModelosContrato(data);
            } catch (error) {
                console.error("Erro ao buscar modelos de contrato:", error);
            }
        };
        fetchModelosContrato();
    }, [])


    const openModalCreateModelo = () => {
        setModalCreateModelo(true);
    }
    const closeModalCreateModelo = () => {
        setModalCreateModelo(false);
    }

    const handleChangeNewContractModel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewModeloContrato({
            ...newModeloContrato,
            [e.target.name]: e.target.value,
        });
    }
    
    const handleCreateNewContractModel = async () => {
        try {
            const newModelContract = await createModelContract(newModeloContrato);
            setModelosContrato([...modelosContrato, newModelContract]);
            closeModalCreateModelo();
        } catch (error) {
            console.error("Erro ao criar modelo de contrato:", error);
        }
    }

    const onRemoveModel = async (id: number) => {
        try {
            await deleteModelContract(id);
            setModelosContrato(modelosContrato.filter(modelo => modelo.ID_ModeloContrato !== id));
        } catch (error) {
            console.error("Erro ao deletar modelo de contrato:", error);
        }
    }

    return (
        <Box width={"70%"} display={"flex"} flexDirection={"column"} alignItems={"center"} margin={"auto"} gap={2} padding={2}>
            <Modal
                open={modalCreateModelo}
                onClose={closeModalCreateModelo}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...style, textAlign: "center"}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Criar Modelo
                    </Typography>
                    <Box display={"flex"} flexDirection={"column"} gap={2} marginTop={2}>
                        <TextField 
                            label="Nome do Modelo" 
                            name="modelCont_Name" 
                            variant="outlined" 
                            placeholder="Digite o nome do modelo" 
                            value={newModeloContrato.modelCont_Name} 
                            onChange={handleChangeNewContractModel} 
                            sx={{ width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                            required
                        />
                        <TextField 
                            label="Descrição do Modelo" 
                            name="modelCont_Descricao" 
                            variant="outlined" 
                            placeholder="Digite a descrição do modelo" 
                            value={newModeloContrato.modelCont_Descricao} 
                            onChange={handleChangeNewContractModel} 
                            sx={{ width: "100%", '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputLabel-root.Mui-focused': { color: '#181393' }, '@media (max-width: 800px)': { width: "100%" } }} 
                            required
                        />
                    </Box>
                    <Box display={"flex"} gap={2} justifyContent={"space-between"} width={"100%"} marginTop={2}>
                        <Box width={"100%"}>
                            <Button 
                                variant="contained"
                                color="primary"
                                sx={{ padding: "15px", width: "100%" }}
                                onClick={handleCreateNewContractModel}
                            >
                                Criar
                            </Button>
                        </Box>
                        <Box width={"100%"}>
                            <Button 
                                variant="contained"
                                color="primary"
                                sx={{ padding: "15px", width: "100%" }}
                                onClick={closeModalCreateModelo}
                            >
                                Fechar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Typography variant="h6">Gerenciar Modelos de Contrato</Typography>
            <ModelContractsTable
                modelosContrato={modelosContrato}
                onRemoveModel={onRemoveModel}
            />
            <Box display={"flex"} gap={2} justifyContent={"center"} width={"100%"}>
                <Box>
                    <Button 
                        variant="contained"
                        color="primary"
                        sx={{ padding: "15px", width: "100%" }}
                        onClick={openModalCreateModelo}
                    >
                        Adicionar Modelo
                    </Button>
                </Box>
                <Box>
                    <GenericButton name="Voltar" type="button" link="/" />
                </Box>
            </Box>
        </Box>
    )
}