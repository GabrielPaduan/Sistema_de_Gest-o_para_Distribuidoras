import api from '../services/api'; // Importa nossa instância centralizada do axios
import { ContractDTO, ContractDTOInsert } from '../utils/DTOS'; // Supondo que você também tenha um arquivo de tipos no frontend

// Função para buscar TODOS os contratos
export const getAllContracts = async (): Promise<ContractDTO[]> => {
  const response = await api.get('/contratos');
  return response.data; // O axios já converte a resposta para JSON
};

// Função para buscar UM contrato pelo ID
export const getContractById = async (id: number): Promise<ContractDTO> => {
  const response = await api.get(`/contratos/${id}`);
  return response.data;
};

export const getContractByClientId = async (id: number): Promise<ContractDTO> => {
  const response = await api.get(`/contratos/${id}`);
  return response.data;
};

export const createContract = async (contractData: Omit<ContractDTOInsert[], 'id'>): Promise<ContractDTOInsert[]> => {
  console.log(contractData);
  const response = await api.post('/contratos', contractData);
  return response.data;
};

export const removeContract = async (id: number): Promise<void> => {
  await api.delete(`/contratos/${id}`);
};

export const updateContract = async (id: number, cmdt: number, qtde: number, valorTotal: number, porcLucro: number): Promise<ContractDTO> => {
  const response = await api.put(`/contratos/${id}`, {cmdt, qtde, valorTotal, porcLucro });
  return response.data;
};