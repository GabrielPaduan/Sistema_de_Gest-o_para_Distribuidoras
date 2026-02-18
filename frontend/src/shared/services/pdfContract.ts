import { PdfStructCompleteDTO, PdfStructDTO, PdfStructInsertDTO } from "../utils/DTOS";
import api from "./api";

export const getAllPDFContracts = async (): Promise<PdfStructDTO[]> => {
  const response = await api.get('/pdfContratos');
  return response.data; 
};

export const getPdfByStatus = async (status: number): Promise<PdfStructDTO[]> => {
  const response = await api.get(`/pdfContratos/status/${status}`);
  return response.data; 
}

export const getPdfById = async (id: number): Promise<PdfStructDTO> => {
  const response = await api.get(`/pdfContratos/id/${id}`)
  return response.data;
}

export const createPDFContracts = async (pdfData: PdfStructInsertDTO): Promise<PdfStructInsertDTO> => {
  console.log("Creating PDF contract with data:", pdfData);
  const response = await api.post('/pdfContratos', pdfData);
  return response.data;
};

export const updatePdf = async (id: number, pdfData: PdfStructDTO): Promise<PdfStructDTO> => {
  console.log(`Updating PDF contract with ID ${id} and data:`, pdfData);
  const response = await api.put(`/pdfContratos/${id}`, pdfData);
  return response.data;
};

export const getPendentPdfByClientId = async (clientId: number): Promise<PdfStructDTO | null> => {
   const response = await api.get(`/pdfContratos/client/pendentPdf/${clientId}`);
   return response.data;
};

export const getPdfByClientId = async (clientId: number): Promise<PdfStructDTO | null> => {
   const response = await api.get(`/pdfContratos/client/${clientId}`);
   return response.data;
}

export const deletePdfContract = async (id: number): Promise<void> => {
  await api.delete(`/pdfContratos/${id}`);
}