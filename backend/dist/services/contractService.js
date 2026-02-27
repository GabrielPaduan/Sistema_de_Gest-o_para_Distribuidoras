import supabase from '../config/supabase.js'; // Ajuste o caminho conforme necessário
export const findAllContracts = async () => {
    const { data, error } = await supabase.from('Contratos').select('*');
    if (error)
        throw error;
    return data;
};
export const createNewContract = async (contractData) => {
    const { data, error } = await supabase.from('Contratos').insert(contractData).select();
    if (error)
        throw error;
    return data;
};
export const findContractsByClientId = async (clientId) => {
    const { data, error } = await supabase.from('Contratos').select('*').eq('Cont_ID_Cli', clientId);
    if (error)
        throw error;
    return data;
};
export const removeContract = async (contractId) => {
    const { error } = await supabase.from('Contratos').delete().eq('ID_Contrato', contractId);
    if (error)
        throw error;
};
export const updateContract = async (contractId, cmdt, qtde, valorTotal, porcLucro) => {
    const { data, error } = await supabase
        .from('Contratos')
        .update({ Cont_Comodato: cmdt, Cont_Qtde: qtde, Cont_ValorTotal: valorTotal, Cont_PorcLucro: porcLucro })
        .eq('ID_Contrato', contractId)
        .select('Cont_Comodato, Cont_Qtde, Cont_ValorTotal, Cont_PorcLucro')
        .single();
    if (error)
        throw error;
    return data;
};
//# sourceMappingURL=contractService.js.map