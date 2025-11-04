import supabase from "../config/supabase.js";
import type { ClientDTO, PdfStructDTO, PdfStructInsertDTO } from "../types/dtos.js";

export const getAllPdfs = async (): Promise<PdfStructDTO[]> => {
  const { data, error } = await supabase.from("ContratosPDF").select("*");
  if (error) throw error;
  return data;
};

export const getPdfByStatus = async (status: number): Promise<PdfStructDTO[]> => {
  const { data, error } = await supabase
    .from("ContratosPDF")
    .select("*")
    .eq("PDF_Status", status);
  if (error) throw error;
  return data;
}

export const createPdf = async (pdfData: PdfStructInsertDTO) => {
  const { data, error } = await supabase.from("ContratosPDF").insert(pdfData).select();
  if (error) throw error;
  return data;
};

export const getPendentPdfByClientId = async (clientId: number): Promise<PdfStructDTO | null> => {
  const { data, error } = await supabase
    .from("ContratosPDF")
    .select("*")
    .eq("PDF_Client_Id", clientId)
    .eq("PDF_Status", 0)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return data;
    } else {
      throw error;
    }
  }
  return data;
};

export const getPdfByClientId = async (clientId: number): Promise<PdfStructDTO[]> => {
    const { data, error } = await supabase
        .from('ContratosPDF')
        .select('*')
        .eq('PDF_Client_Id', clientId)
        .eq('PDF_Status', 1);
    if (error) throw error;
    return data;
};

export const updatePdf = async (
    id: number,
    PDF_Client_Id: number,
    PDF_Status: number,
    PDF_Generated_Date: string,
    PDF_Observacoes: string
): Promise<{ PDF_Client_Id: number; PDF_Status: number; PDF_Generated_Date: string; PDF_Observacoes: string }> => {
    const { data, error } = await supabase
        .from('ContratosPDF')
        .update({ PDF_Client_Id: PDF_Client_Id, PDF_Status: PDF_Status, PDF_Generated_Date: PDF_Generated_Date, PDF_Observacoes: PDF_Observacoes })
        .eq('id', id)
        .select('PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes')
        .single();
    if (error) throw error;
    return data;
};