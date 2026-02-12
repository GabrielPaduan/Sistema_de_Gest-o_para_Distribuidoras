import supabase from "../config/supabase.js";
import type { ModelosContratoItensDTO, ModelosContratoItensDTOInsert } from "../types/dtos.js";

export const getModelContractItensById = async (id: number): Promise<ModelosContratoItensDTO[]> => {
    const {data, error} = await supabase.from("ModelosContratoItens").select("*").eq("modelContItens_IDModelCont", id);
    if (error) throw error;
    if (!data) return [];
    return data;
}

export const createModelContractItem = async (itemData: ModelosContratoItensDTOInsert): Promise<ModelosContratoItensDTO> => {
    console.log("Criando item de contrato com dados:", itemData);
    const {data, error} = await supabase.from("ModelosContratoItens").insert(itemData).select("*").single();
    if (error) throw error;
    console.log("Item de contrato criado com sucesso:", data);
    return data;
}

export const deleteModelContractItem = async (id: number): Promise<void> => {
    const {error} = await supabase.from("ModelosContratoItens").delete().eq("ID_ModelosContratoItens", id);
    if (error) throw error;
}

export const updateModelContractItem = async (
    id: number, 
    cmdt: number,
    porcLucro: number): Promise<ModelosContratoItensDTO> => {
    const {data, error} = await supabase
        .from("ModelosContratoItens")
        .update({ modelContItens_Comodato: cmdt, modelContItens_PorcLucro: porcLucro })
        .eq("ID_ModelosContratoItens", id)
        .select("*")
        .single();
    if (error) throw error;
    console.log("Item de contrato atualizado com sucesso:", data);
    return data;
}