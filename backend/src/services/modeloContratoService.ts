import supabase from "../config/supabase.js";
import type { ModelosContratoDTO, ModelosContratoDTOInsert } from "../types/dtos.js";

export const getAllModelContracts = async (): Promise<ModelosContratoDTO[]> => {
    const {data, error } = await supabase.from("ModelosContrato").select("*").range(0, 8000);
    if (error) throw error;
    if (!data) return [];
    return data;
}

export const getModelContractById = async (id: number): Promise<ModelosContratoDTO | null> => {
    const {data, error} = await supabase.from("ModelosContrato").select("*").eq("ID_ModeloContrato", id).single();
    if (error) throw error;
    return data;
}

export const createModelContract = async (modelContract: ModelosContratoDTOInsert): Promise<ModelosContratoDTO> => {
    console.log("Criando modelo de contrato:", modelContract);
    const {data, error } = await supabase.from("ModelosContrato").insert(modelContract).select("*").single();
    if (error) throw error;
    console.log("Modelo de contrato criado com sucesso:", data);
    return data;
}

export const deleteModelContract = async (id: number): Promise<void> => {
    const { error } = await supabase.from("ModelosContrato").delete().eq("ID_ModeloContrato", id);
    if (error) throw error;
}