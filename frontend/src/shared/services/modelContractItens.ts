import { ModelosContratoItensDTO, ModelosContratoItensDTOInsert } from "../utils/DTOS";
import api from "./api";

export const getModelContractItensById = async (id: number): Promise<ModelosContratoItensDTO[]> => {
    const response = await api.get(`/modelosContratoItens/${id}`);
    return response.data;
}

export const createModelContractItem = async (item: ModelosContratoItensDTOInsert): Promise<ModelosContratoItensDTO> => {
    const response = await api.post('/modelosContratoItens', item);
    return response.data;
}

export const deleteModelContractItem = async (id: number): Promise<void> => {
    await api.delete(`/modelosContratoItens/${id}`);
}

export const updateModelContractItem = async (id: number, cmdt: number, porcLucro: number): Promise<ModelosContratoItensDTO> => {
    const response = await api.put(`/modelosContratoItens/${id}`, { modelContItens_Comodato: cmdt, modelContItens_PorcLucro: porcLucro });
    return response.data;
}