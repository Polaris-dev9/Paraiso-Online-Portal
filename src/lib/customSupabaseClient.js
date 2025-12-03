import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eymkoopvzukbigeoikkf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bWtvb3B2enVrYmlnZW9pa2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDAzMDksImV4cCI6MjA3MzAxNjMwOX0.Et7qVBvwAf6MbjblnTLCNvYqPhkKM4LzwjS4NR6YZTw';

// Criar cliente com configuração para usar schema api
// O Supabase está configurado para aceitar apenas schema 'api'
const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'api'  // Usar schema 'api' em vez de 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
