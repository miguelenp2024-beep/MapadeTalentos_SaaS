import { createClient } from '@supabase/supabase-js';

// Usamos as variáveis de ambiente que estarão no seu .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Atenção: Variáveis de ambiente do Supabase não encontradas. Verifique o arquivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
