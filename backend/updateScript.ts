// updateScript.ts
import { createClient } from '@supabase/supabase-js';

// Carregue suas variáveis de ambiente (ex: de um .env)
import 'dotenv/config'; 

// Use suas variáveis de URL e a CHAVE DE SERVIÇO (service_role)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // <-- Use a service_role key!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY precisam estar no .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BATCH_SIZE = 1000; // Limite padrão do Supabase

async function updateAllProducts() {
  console.log('Iniciando script de atualização em massa...');
  let page = 0;
  let hasMoreData = true;

  while (hasMoreData) {
    const from = page * BATCH_SIZE;
    const to = from + BATCH_SIZE - 1;

    console.log(`Buscando lote ${page + 1} (produtos de ${from} a ${to})...`);

    // 1. BUSCAR um lote de produtos
    const { data: products, error: fetchError } = await supabase
      .from('Produtos') // <-- MUDE AQUI
      .select('*') // Selecione as colunas que você precisa
      .range(from, to);

    if (fetchError) {
      console.error('Erro ao buscar produtos:', fetchError.message);
      break; // Para o script se houver um erro de busca
    }

    // Se não vier mais data, ou a data for menos que o BATCH_SIZE, paramos
    if (!products || products.length === 0) {
      hasMoreData = false;
      console.log('Não há mais produtos para buscar.');
      break;
    }
    
    // 2. MODIFICAR os produtos deste lote
    const updatedProducts = products.map(product => {
      // --- SUA LÓGICA DE ATUALIZAÇÃO VAI AQUI ---
      // Exemplo: atualizar o 'Prod_PorcLucro' de todos os produtos
   

      return {
        ...product, // Mantém todos os dados antigos
        Prod_PorcLucro: product.Prod_PorcLucro < 0 ? 0 : product.Prod_PorcLucro, // Define o novo valor para a coluna
        // Outro exemplo:
        // product.Prod_Estoque = product.Prod_Estoque + 10;
        // return product;
      };
      // -------------------------------------------
    });

    console.log(`Preparando para atualizar ${updatedProducts.length} produtos...`);

    // 3. ENVIAR o lote atualizado de volta
    // 'upsert' vai atualizar as linhas existentes baseado na sua chave primária (ex: 'id')
    const { error: updateError } = await supabase
      .from('Produtos') // <-- MUDE AQUI
      .upsert(updatedProducts);

    if (updateError) {
      console.error('Erro ao atualizar o lote:', updateError.message);
      // Você pode decidir parar (break) ou continuar para o próximo lote
    } else {
      console.log(`Lote ${page + 1} atualizado com sucesso.`);
    }

    // Se o número de produtos buscados for menor que o BATCH_SIZE,
    // significa que esta foi a última página.
    if (products.length < BATCH_SIZE) {
      hasMoreData = false;
    } else {
      page++; // Prepara para buscar a próxima página
    }
  }

  console.log('Script de atualização concluído.');
}

// Executa a função
updateAllProducts().catch(console.error);