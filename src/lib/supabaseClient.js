// ============================================================
//  CLIENTE SUPABASE
//  Lê a URL e a chave pública do arquivo .env (não sobe pro Git).
// ============================================================

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !chave) {
  console.warn(
    'Supabase não configurado: verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão no arquivo .env'
  )
}

export const supabase = createClient(url, chave)
