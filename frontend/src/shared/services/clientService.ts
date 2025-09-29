import api from '../services/api'; // Importa nossa instância centralizada do axios
import { ClientDTO } from '../utils/DTOS'; // Supondo que você também tenha um arquivo de tipos no frontend

// Função para buscar TODOS os clientes
export const getAllClients = async (): Promise<ClientDTO[]> => {
  const response = await api.get('/clientes');
  return response.data; // O axios já converte a resposta para JSON
};

// Função para buscar UM cliente pelo ID
export const getClientById = async (id: number): Promise<ClientDTO> => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

// Função para CRIAR um novo cliente
// Omit<ClientDTO, 'id'> significa que pegamos todos os campos do ClientDTO, exceto o 'id'
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