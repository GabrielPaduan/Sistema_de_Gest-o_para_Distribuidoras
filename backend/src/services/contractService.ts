import supabase from '../config/supabase.js'; // Ajuste o caminho conforme necessário
import type { ContractDTO } from '../types/dtos.js'; // Supondo que você tenha seus tipos definidos

export const findAllContracts = async (): Promise<ContractDTO[]> => {
    const { data, error } = await supabase.from('Contratos').select('*');
    if (error) throw error;
    return data;
};

export const createNewContract = async (contractData: Omit<ContractDTO, 'id'>): Promise<ContractDTO[]> => {
    const { data, error } = await supabase.from('Contratos').insert([contractData]).select();
    console.log("Contrato Criado: ", data);
    if (error) throw error;
    return data;
};

export const findContractsByClientId = async (clientId: string): Promise<ContractDTO[]> => {
    const { data, error } = await supabase.from('Contratos').select('*').eq('Cont_ID_Cli', clientId);
    if (error) throw error;
    return data;
};

export const removeContract = async (contractId: number): Promise<void> => {
    const { error } = await supabase.from('Contratos').delete().eq('ID_Contrato', contractId);
    if (error) throw error;
};

export const updateContract = async (
    contractId: number,
    cmdt: number,
    qtde: number,
    valorTotal: number,
    porcLucro: number
): Promise<{ Cont_Comodato: number; Cont_Qtde: number; Cont_ValorTotal: number; Cont_PorcLucro: number }> => {
    const { data, error } = await supabase
        .from('Contratos')
        .update({ Cont_Comodato: cmdt, Cont_Qtde: qtde, Cont_ValorTotal: valorTotal, Cont_PorcLucro: porcLucro })
        .eq('ID_Contrato', contractId)
        .select('Cont_Comodato, Cont_Qtde, Cont_ValorTotal, Cont_PorcLucro')
        .single();
    if (error) throw error;
    return data;
};
 
