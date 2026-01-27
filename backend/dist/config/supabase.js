import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Carrega as variáveis de ambiente do seu arquivo .env
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
// Cria a instância do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
// Exporta a instância para ser usada em qualquer lugar do projeto
export default supabase;
//# sourceMappingURL=supabase.js.map