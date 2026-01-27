import supabase from '../config/supabase.js'; // Ajuste o caminho conforme necessário
export const findAllProduct = async () => {
    const { data, error } = await supabase.from('Produtos').select('*').range(0, 8000);
    if (error)
        throw error;
    return data;
};
export const createNewProduct = async (productData) => {
    const { data, error } = await supabase.from('Produtos').insert([productData]).select();
    if (error)
        throw error;
    return data;
};
export const updateProduct = async (productData) => {
    const { error } = await supabase.from('Produtos').update([productData]).eq('ID_Prod', productData.ID_Prod);
    if (error)
        throw error;
};
export const findProductById = async (id) => {
    const { data, error } = await supabase.from('Produtos').select('*').eq('ID_Prod', id).single();
    if (error) {
        console.error('Erro ao buscar produto por ID:', error);
        return null;
    }
    return data;
};
export const findProductByContractId = async (contractId) => {
    const { data, error } = await supabase
        .from('Contratos')
        .select(`
      Produtos ( * )
    `)
        .eq('ID_Contrato', contractId)
        .single();
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Erro ao buscar produto do contrato:', error);
        throw error;
    }
    const product = Array.isArray(data.Produtos) ? data.Produtos[0] : data.Produtos;
    // Retorna o produto diretamente, garantindo que não seja undefined.
    return product ?? null;
};
export const searchProductsByName = async (nameQuery) => {
    if (!nameQuery) {
        return []; // Retorna vazio se a busca for vazia
    }
    try {
        const { data, error } = await supabase
            .from('Produtos')
            .select('*')
            .ilike('Prod_CodProduto', `%${nameQuery}%`)
            .limit(50);
        if (error) {
            console.error("Erro ao buscar produtos:", error);
            throw new Error(`Erro ao buscar produtos: ${error.message}`);
        }
        return data || [];
    }
    catch (error) {
        console.error("Exceção na busca de produtos:", error);
        throw error;
    }
};
export const deleteProductById = async (id) => {
    const { error: errorContrato } = await supabase.from('Contratos').delete().eq('Cont_ID_Prod', id);
    if (errorContrato) {
        console.error('Erro ao remover contratos associados ao produto:', errorContrato);
        throw errorContrato;
    }
    const { error } = await supabase.from('Produtos').delete().eq('ID_Prod', id);
    if (error) {
        console.error('Erro ao remover produto:', error);
        throw error;
    }
};
export function findAllProductWithPagination(page, pageSize) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=productService.js.map