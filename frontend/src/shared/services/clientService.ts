import api from '../services/api'; // Importa nossa instância centralizada do axios
import { ClientDTO, ContractDTO } from '../utils/DTOS'; // Supondo que você também tenha um arquivo de tipos no frontend

export const getAllClients = async (): Promise<ClientDTO[]> => {
  const response = await api.get('/clientes');
  return response.data;
};

export const getClientById = async (id: number): Promise<ClientDTO> => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

export const getClientByPDF = async (): Promise<ClientDTO> => {
  const response = await api.get(`/clientes/pdfClientes/list`);
  return response.data;
};

export const createClient = async (clientData: Omit<ClientDTO, 'id'>): Promise<ClientDTO[]> => {
  const response = await api.post('/clientes', clientData);
  return response.data;
};

export const removeClient = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};

export const getModelClients = async (): Promise<ClientDTO[]> => {
  const response = await api.get('/clientes/modelos/list');
  return response.data;
};

export const getModelContracts = async (modelId: number): Promise<ContractDTO[]> => {
  const response = await api.get(`/clientes/modelos/${modelId}`);
  return response.data;
}

export const updateClient = async (clientData: ClientDTO): Promise<void> => {
  await api.put(`/clientes/${clientData.id}`, clientData);
}

export const updateClientStatus = async (id: number): Promise<void> => {
  await api.put(`/clientes/status/${id}`);
}

export const searchClientsByName = async (name: string): Promise<ClientDTO[]> => {
  const response = await api.get(`/clientes/search`, {
    params: { q: name }
  });
  return response.data;
}