import supabase from "../config/supabase.js";
export const getAllPdfs = async () => {
    const { data, error } = await supabase.from("ContratosPDF").select("*");
    if (error)
        throw error;
    return data;
};
export const getPdfByStatus = async (status) => {
    const { data, error } = await supabase
        .from("ContratosPDF")
        .select("*")
        .eq("PDF_Status", status);
    if (error)
        throw error;
    return data;
};
export const getPdfById = async (id) => {
    const { data, error } = await supabase.from("ContratosPDF").select("*").eq("id", id).single();
    if (error)
        throw error;
    return data;
};
export const createPdf = async (pdfData) => {
    console.log("Creating PDF contract with data:", pdfData);
    const { data, error } = await supabase.from("ContratosPDF").insert(pdfData).select();
    console.log(error);
    if (error)
        throw error;
    return data;
};
export const getPendentPdfByClientId = async (clientId) => {
    const { data, error } = await supabase
        .from("ContratosPDF")
        .select("*")
        .eq("PDF_Client_Id", clientId)
        .single();
    console.log("Fetching pendent PDF for client ID:", data);
    if (error) {
        if (error.code === 'PGRST116') {
            return data;
        }
        else {
            throw error;
        }
    }
    return data;
};
export const getPdfByClientId = async (clientId) => {
    const { data, error } = await supabase
        .from('ContratosPDF')
        .select('*')
        .eq('PDF_Client_Id', clientId)
        .neq('PDF_Status', 0);
    if (error)
        throw error;
    return data;
};
export const updatePdf = async (id, PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes, PDF_Valor, PDF_ValorPago) => {
    console.log(`Updating PDF contract with ID ${id} and data:`, { PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes, PDF_Valor, PDF_ValorPago });
    if (PDF_Valor < 0 || PDF_ValorPago < 0) {
        throw new Error("Valor e o valor pago do contrato não podem ser negativos.");
    }
    const { data: contractData, error: contractError } = await supabase
        .from('ContratosPDF')
        .select('PDF_ValorPago')
        .eq('id', id)
        .single();
    if (contractError) {
        console.error("Erro ao buscar contrato relacionado ao PDF:", contractError);
        throw new Error("Erro ao validar os valores do contrato.");
    }
    contractData.PDF_ValorPago = PDF_ValorPago + contractData.PDF_ValorPago;
    if (contractData.PDF_ValorPago.toFixed(2) > PDF_Valor.toFixed(2)) {
        throw new Error("Valor pago não pode ser maior que o valor total do contrato.");
    }
    if (contractData.PDF_ValorPago.toFixed(2) === PDF_Valor.toFixed(2)) {
        PDF_Status = 2;
    }
    const { data, error } = await supabase
        .from('ContratosPDF')
        .update({ PDF_Client_Id: PDF_Client_Id, PDF_Status: PDF_Status, PDF_Generated_Date: PDF_Generated_Date, PDF_Observacoes: PDF_Observacoes, PDF_Valor: PDF_Valor, PDF_ValorPago: contractData.PDF_ValorPago })
        .eq('id', id)
        .select('PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes, PDF_Valor, PDF_ValorPago')
        .single();
    if (error)
        throw error;
    return data;
};
export const deletePdf = async (id) => {
    const { error } = await supabase.from('ContratosPDF').delete().eq('id', id);
    if (error)
        throw error;
};
//# sourceMappingURL=pdfService.js.map