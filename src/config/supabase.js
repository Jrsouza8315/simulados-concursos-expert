// Configuração do cliente Supabase
export const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL";
export const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

// Inicialização do cliente Supabase
export const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
