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
export const productLaunch = async (productToLaunch, launchType) => {
    const product = await findProductById(productToLaunch.ID_Prod);
    if (!product) {
        throw new Error('Produto não encontrado');
    }
    if (launchType === 0) {
        const newStock = Number(product.Prod_Estoque) + Number(productToLaunch.Prod_QuantidadeLancada);
        let newCustoCompra = 0;
        if (productToLaunch.Prod_CustoCompra > product.Prod_CustoCompra) {
            newCustoCompra = productToLaunch.Prod_CustoCompra;
        }
        else {
            newCustoCompra = product.Prod_CustoCompra;
        }
        const { data, error } = await supabase
            .from('Produtos')
            .update({
            Prod_Estoque: newStock,
            Prod_CustoCompra: newCustoCompra,
        })
            .eq('ID_Prod', productToLaunch.ID_Prod);
        console.log("DATA: ", data);
        if (error) {
            console.error('Erro ao lançar entrada de produto:', error);
            throw error;
        }
    }
    else if (launchType === 1) {
        const newStock = Number(product.Prod_Estoque) - Number(productToLaunch.Prod_QuantidadeLancada);
        if (newStock < 0) {
            throw new Error('Estoque insuficiente para a saída');
        }
        const { error } = await supabase
            .from('Produtos')
            .update({
            Prod_Estoque: newStock,
        })
            .eq('ID_Prod', productToLaunch.ID_Prod);
        if (error) {
            console.error('Erro ao lançar saída de produto:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=productService.js.map