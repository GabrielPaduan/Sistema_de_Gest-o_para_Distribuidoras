import supabase from "../config/supabase.js"
import type { ProductLaunch } from "../types/dtos.js"

export const getAllLaunches = async (): Promise<ProductLaunch[]> => {
    const {data, error} = await supabase.from("LancamentoProdutos").select("*").range(0, 8000)
    if (error ) throw error;
    return data;
}

export const createLaunch = async (launchProductData: Omit<ProductLaunch, "LancProd_ID">): Promise<ProductLaunch> => {
    const { data, error } = await supabase.from("LancamentoProdutos").insert({LancProd_IDProd: launchProductData.LancProd_IDProd, LancProd_CodProd: launchProductData.LancProd_CodProd, LancProd_QtdeLanc: launchProductData.LancProd_QtdeLanc, LancProd_CustoCompra: launchProductData.LancProd_CustoCompra, LancProd_Data: launchProductData.LancProd_Data, LancProd_Observacao: launchProductData.LancProd_Observacao, LancProd_Tipo: launchProductData.LancProd_Tipo, LancProd_OperadorId: launchProductData.LancProd_OperadorId, LancProd_OperadorName: launchProductData.LancProd_OperadorName }).select().single();
    if (error) throw error;
    return data;
}

export const getLaunchByProductId = async (productId: number): Promise<ProductLaunch[]> => {
    const { data, error } = await supabase
        .from("LancamentoProdutos")
        .select("*")
        .eq("LancProd_IDProd", productId);
    if (error) {
        if (error.code === "PGRST116") {
            return []; // No record found
        }
        throw error;
    }
    return data;
}