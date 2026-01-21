import supabase from '../config/supabase.js'; // Ajuste o caminho conforme necessário
import type { ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from '../types/dtos.js';

export const findAllCategories = async (): Promise<ProductsCategoriesDTO[]> => {
    const { data, error } = await supabase.from('CategoriasProdutos').select('*');
    console.log("Teste", data);
    if (error) throw error;
    return data;
};

export const createCategory = async (CatProd_Nome: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTOInsert> => {
    console.log("Nome da categoria:", CatProd_Nome);
    const { data, error } = await supabase
        .from('CategoriasProdutos')
        .insert({ CatProd_Nome: CatProd_Nome.CatProd_Nome })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const updateCategory = async (categoryID: number, CatProd_Nome: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTO> => {
    const { data, error } = await supabase
        .from('CategoriasProdutos')
        .update({ CatProd_Nome: CatProd_Nome.CatProd_Nome })
        .eq('ID_CategoriaProduto', categoryID)
        .select()
        .single();
    if (error) throw error;
    return data;
}   

export const deleteCategory = async (categoryID: number): Promise<void> => {
    const { error: errorProducts } = await supabase
        .from('Produtos')
        .update({ Prod_Categoria: null })
        .eq('Prod_Categoria', categoryID);
    if (errorProducts) throw errorProducts;

    const { error } = await supabase
        .from('CategoriasProdutos')
        .delete()
        .eq('ID_CategoriaProduto', categoryID);
    if (error) throw error;
};
