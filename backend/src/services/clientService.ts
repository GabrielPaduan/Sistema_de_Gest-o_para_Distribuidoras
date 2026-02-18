import supabase from '../config/supabase.js'; 
import type { ClientDTO, ClientDTOInsert, ContractDTO } from '../types/dtos.js';

export const findAllClients = async (): Promise<ClientDTO[]> => {
    const { data, error } = await supabase.from('Clientes').select('*');
    if (error) throw error;
    return data;
};

export const findClientByPDF = async (): Promise<ClientDTO[]> => {
    const { data, error } = await supabase.from('ContratosPDF').select(` Clientes ( * ) `);
    if (error) throw error;

    if (!data || data.length === 0) {
        return [];
    }

    const dataClients: ClientDTO[] = data
        .flatMap(contrato => contrato.Clientes)
        .filter(cliente => cliente);

    const uniqueClientsMap = new Map<number, ClientDTO>();
    for (const client of dataClients) {
        if (client && client.id) { 
            uniqueClientsMap.set(client.id, client);
        }
    }

    const uniqueClients: ClientDTO[] = Array.from(uniqueClientsMap.values());

    return uniqueClients;
};

export const updateClientById = async (clientData: ClientDTO): Promise<boolean> => {
    const { error } = await supabase
        .from('Clientes')
        .update(clientData)
        .eq('id', clientData.id);

    if (error) throw error;
    return true;
};

export const findModelClients = async (): Promise<ClientDTO[]> => {
    const { data, error } = await supabase.from('Clientes').select('*').eq('cli_modelo', 1);
    if (error) throw error;
    return data;
};

export const createNewClient = async (clientData: ClientDTOInsert): Promise<ClientDTO[]> => {
    console.log("Teste - Dados do cliente a serem inseridos:", clientData);
    const { data, error } = await supabase
        .from('Clientes')
        .insert([clientData])
        .select();

    if (error) throw error;
    return data;
};

export const findClientById = async (id: number): Promise<ClientDTO | null> => {
    
    const { data, error } = await supabase.from('Clientes').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const deleteClientById = async (id: number): Promise<boolean> => {
    const { error } = await supabase.from('Contratos').delete().eq('Cont_ID_Cli', id);
    if (error) throw error;

    const { error: errorPDF } = await supabase.from('ContratosPDF').delete().eq('PDF_Client_Id', id);
    if (errorPDF) throw errorPDF;

    const { error: errorCliente } = await supabase.from('Clientes').delete().eq('id', id);
    if (errorCliente) throw errorCliente;
    return true;
};

export const getModelContracts = async (modelId: number): Promise<ContractDTO[] | null> => {
    const { data, error } = await supabase
        .from('Clientes')
        .select(`Contratos ( * )`)
        .eq('cli_modelo', 1)
        .eq('id', modelId);

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Erro ao buscar contratos do modelo:', error);
        throw error;
    }

    const contratos: ContractDTO[] | undefined = Array.isArray(data) && data.length > 0 ? data[0]?.Contratos : undefined;

    return contratos || null;
};

export const updateStatusClient = async (id: number): Promise<boolean> => {
    const { error } = await supabase
        .from('Clientes')
        .update({ cli_ClienteAtivo: true })
        .eq('id', id);

    if (error) throw error;
    return true;
}