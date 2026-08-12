// ============================================================
//  LOG DE ATIVIDADES
//  Registra quem fez o quê (criar/editar/excluir/alternar) em
//  cada produto, usando o e-mail do usuário logado no Supabase.
// ============================================================

import { supabase } from './supabaseClient.js'

// Grava uma linha no log. Nunca interrompe a ação principal caso falhe.
export async function registrarLog(acao, produto, detalhe = '') {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('log_atividades').insert({
      usuario_email: user?.email || 'desconhecido',
      acao,
      produto_id: produto?.id ?? null,
      produto_nome: produto?.nome ?? '',
      detalhe,
    })
    if (error) console.error('Erro ao registrar log de atividade:', error)
  } catch (e) {
    console.error('Erro ao registrar log de atividade:', e)
  }
}

// Busca os registros mais recentes do log
export async function listarLogs(limite = 50) {
  const { data, error } = await supabase
    .from('log_atividades')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(limite)
  if (error) {
    console.error('Erro ao carregar log de atividades:', error)
    return []
  }
  return data
}
