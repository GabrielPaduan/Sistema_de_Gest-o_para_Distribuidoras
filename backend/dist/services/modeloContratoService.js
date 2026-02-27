import supabase from "../config/supabase.js";
export const getAllModelContracts = async () => {
    const { data, error } = await supabase.from("ModelosContrato").select("*").range(0, 8000);
    if (error)
        throw error;
    if (!data)
        return [];
    return data;
};
export const getModelContractById = async (id) => {
    const { data, error } = await supabase.from("ModelosContrato").select("*").eq("ID_ModeloContrato", id).single();
    if (error)
        throw error;
    return data;
};
export const createModelContract = async (modelContract) => {
    console.log("Criando modelo de contrato:", modelContract);
    const { data, error } = await supabase.from("ModelosContrato").insert(modelContract).select("*").single();
    if (error)
        throw error;
    console.log("Modelo de contrato criado com sucesso:", data);
    return data;
};
export const deleteModelContract = async (id) => {
    const { error } = await supabase.from("ModelosContrato").delete().eq("ID_ModeloContrato", id);
    if (error)
        throw error;
};
//# sourceMappingURL=modeloContratoService.js.map