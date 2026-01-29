import supabase from '../config/supabase.js'; // Ajuste o caminho conforme necessário
import type { ProductDTO, ProductLaunch } from '../types/dtos.js'; // Supondo que você tenha seus tipos definidos

export const findAllProduct = async (): Promise<ProductDTO[]> => {
    const { data, error } = await supabase.from('Produtos').select('*').range(0, 8000);
    if (error) throw error;
    return data;
};

export const createNewProduct = async (productData: Omit<ProductDTO, 'id'>): Promise<ProductDTO[]> => {
    const { data, error } = await supabase.from('Produtos').insert([productData]).select();
    if (error) throw error;
    return data;
};

export const updateProduct = async (productData: ProductDTO): Promise<void> => {
  const { error} = await supabase.from('Produtos').update([productData]).eq('ID_Prod', productData.ID_Prod);
  if (error) throw error;
}

export const findProductById = async (id: number): Promise<ProductDTO | null> => {
  const { data, error } = await supabase.from('Produtos').select('*').eq('ID_Prod', id).single();
  if (error) {
    console.error('Erro ao buscar produto por ID:', error);
    return null;
  }
  return data;
};

export const findProductByContractId = async (contractId: number): Promise<ProductDTO | null> => {
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

  const product: ProductDTO | undefined = Array.isArray(data.Produtos) ? data.Produtos[0] : data.Produtos;
  // Retorna o produto diretamente, garantindo que não seja undefined.
  return product ?? null;
};

export const searchProductsByName = async (nameQuery: string): Promise<any[]> => {
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
    } catch (error) {
        console.error("Exceção na busca de produtos:", error);
        throw error;
    }
};

export const deleteProductById = async (id: number): Promise<void> => {
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

export function findAllProductWithPagination(page: number, pageSize: number): { products: any; total: any; } | PromiseLike<{ products: any; total: any; }> {
    throw new Error('Function not implemented.');
}

export const productLaunch = async (productToLaunch: ProductLaunch, launchType: number): Promise<void> => {
    const product = await findProductById(productToLaunch.ID_Prod);
    if (!product) {
        throw new Error('Produto não encontrado');
    }
    console.log("PRODUCT TO LAUNCH: ", productToLaunch);
    console.log("LAUNCH TYPE: ", launchType);
    if (launchType === 0) { 
        const newStock = Number(product.Prod_Estoque) + Number(productToLaunch.Prod_QuantidadeLancada);
        let newCustoCompra = 0
        if (productToLaunch.Prod_CustoCompra > product.Prod_CustoCompra) {
          newCustoCompra = productToLaunch.Prod_CustoCompra;
        } else {
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
    } else if (launchType === 1) { 
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
} 
