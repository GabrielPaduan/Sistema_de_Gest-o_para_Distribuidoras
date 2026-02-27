import supabase from "../config/supabase.js";
export const getModelContractItensById = async (id) => {
    const { data, error } = await supabase.from("ModelosContratoItens").select("*").eq("modelContItens_IDModelCont", id);
    if (error)
        throw error;
    if (!data)
        return [];
    return data;
};
export const createModelContractItem = async (itemData) => {
    console.log("Criando item de contrato com dados:", itemData);
    const { data, error } = await supabase.from("ModelosContratoItens").insert(itemData).select("*").single();
    if (error)
        throw error;
    console.log("Item de contrato criado com sucesso:", data);
    return data;
};
export const deleteModelContractItem = async (id) => {
    const { error } = await supabase.from("ModelosContratoItens").delete().eq("ID_ModelosContratoItens", id);
    if (error)
        throw error;
};
export const updateModelContractItem = async (id, cmdt, porcLucro) => {
    const { data, error } = await supabase
        .from("ModelosContratoItens")
        .update({ modelContItens_Comodato: cmdt, modelContItens_PorcLucro: porcLucro })
        .eq("ID_ModelosContratoItens", id)
        .select("*")
        .single();
    if (error)
        throw error;
    console.log("Item de contrato atualizado com sucesso:", data);
    return data;
};
//# sourceMappingURL=modeloContratoItensService.js.map