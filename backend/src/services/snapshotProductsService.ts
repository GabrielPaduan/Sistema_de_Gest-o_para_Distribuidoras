import supabase from "../config/supabase.js";
import type { SnapshotProductDTOInsert } from "../types/dtos.js";

export const createSnapshotProduct = async (snapshotData: SnapshotProductDTOInsert): Promise<SnapshotProductDTOInsert> => {
    console.log("Creating snapshot product with data:", snapshotData);

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