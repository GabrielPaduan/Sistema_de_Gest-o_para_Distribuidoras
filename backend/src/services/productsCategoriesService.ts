import supabase from '../config/supabase.js'; // Ajuste o caminho conforme necessário
import type { ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from '../types/dtos.js';

export const findAllCategories = async (): Promise<ProductsCategoriesDTO[]> => {
    const { data, error } = await supabase.from('CategoriasProdutos').select('*');
    if (error) throw error;
    return data;
};

export const createCategory = async (categoria: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTOInsert> => {
    const { data, error } = await supabase
        .from('CategoriasProdutos')
        .insert({ CatProd_Nome: categoria.CatProd_Nome, Cat_Prateleira: categoria.Cat_Prateleira })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const updateCategory = async (categoryID: number, categoria: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTO> => {
    console.log("Updating category:", categoryID, categoria);
    const { data, error } = await supabase
        .from('CategoriasProdutos')
        .update({ CatProd_Nome: categoria.CatProd_Nome, Cat_Prateleira: categoria.Cat_Prateleira })
        .eq('ID_CategoriaProduto', categoryID)
        .select()
        .single();
    if (error) throw error;
    return data;
}   

export const deleteCategory = async (categoryID: number): Promise<void> => {
    if (categoryID !== 0) {
        const { error: errorSnapshots } = await supabase
            .from('ContratosPDF_Itens')
            .update({ snapshot_prod_cat: 0 })
            .eq('snapshot_prod_cat', categoryID);
        if (errorSnapshots) throw errorSnapshots;

        const { error: errorProducts } = await supabase
            .from('Produtos')
            .update({ Prod_Categoria: 0 })
            .eq('Prod_Categoria', categoryID);
        if (errorProducts) throw errorProducts;

        const { error } = await supabase
            .from('CategoriasProdutos')
            .delete()
            .eq('ID_CategoriaProduto', categoryID);
        if (error) throw error;
    }
};
