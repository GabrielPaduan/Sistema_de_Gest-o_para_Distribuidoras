import { ModelosContratoDTO } from "../utils/DTOS";
import api from "./api";

export const getAllModelContracts = async (): Promise<ModelosContratoDTO[]> => {
    const response = await api.get('/modelosContrato');
    return response.data;
}

export const createModelContract = async (modelContract: Omit<ModelosContratoDTO, "modelCont_Id">): Promise<ModelosContratoDTO> => {
    const response = await api.post('/modelosContrato', modelContract);
    return response.data;
}

export const deleteModelContract = async (id: number): Promise<void> => {
    try {
        await api.delete(`/modelosContrato/${id}`);
    } catch (error) {
        console.error("Erro ao deletar modelo de contrato:", error);
        throw error;
    }
}