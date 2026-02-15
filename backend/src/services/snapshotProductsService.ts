import supabase from "../config/supabase.js";
import type { SnapshotProductDTOInsert } from "../types/dtos.js";

export const createSnapshotProduct = async (snapshotData: SnapshotProductDTOInsert): Promise<SnapshotProductDTOInsert> => {
    try {
        const { data, error } = await supabase
            .from('ContratosPDF_Itens')
            .insert(snapshotData)
            .single();
        if (error) {
            throw new Error(`Error creating snapshot product: ${error.message}`);
        }
        return data;
    } catch (error) {
        console.error("Error in createSnapshotProduct:", error);
        throw new Error("Error creating snapshot product");
    }
}

export const getSnapshotProductsByPdfId = async (pdfId: number): Promise<SnapshotProductDTOInsert[]> => { 
    try {
        const { data, error } = await supabase
            .from('ContratosPDF_Itens')
            .select('*')
            .eq('ContPDFItens_PDF_ID', pdfId);
        if (error) {
            throw new Error(`Error fetching snapshot products: ${error.message}`);
        }
        return data;
    } catch (error) {
        console.error("Error in getSnapshotProductsByPdfId:", error);
        throw new Error("Error fetching snapshot products");
    }
};

export const deleteSnapshotProduct = async (snapshotId: number): Promise<void> => {
    try {
        const { error } = await supabase   
            .from('ContratosPDF_Itens')
            .delete()
            .eq('ID_ContPDFItens', snapshotId);
        if (error) {
            throw new Error(`Error deleting snapshot product: ${error.message}`);
        }
    } catch (error) {  
        console.error("Error in deleteSnapshotProduct:", error);
        throw new Error("Error deleting snapshot product");
    }
}