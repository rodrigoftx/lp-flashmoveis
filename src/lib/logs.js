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

// Busca o IP público de quem está acessando o site (serviço externo gratuito).
// Se não conseguir (sem internet pro serviço, bloqueio, etc.), retorna null e
// o registro é salvo mesmo assim, só sem o IP.
async function obterIP() {
  try {
    const controlador = new AbortController()
    const tempoLimite = setTimeout(() => controlador.abort(), 4000)
    const resp = await fetch('https://api.ipify.org?format=json', { signal: controlador.signal })
    clearTimeout(tempoLimite)
    const dados = await resp.json()
    return dados.ip || null
  } catch (e) {
    return null
  }
}

// Registra uma tentativa de login que falhou (senha/e-mail incorretos).
// Roda antes do usuário estar autenticado, por isso a tabela permite
// inserção pública (só inserção — a leitura é restrita a quem já está logado).
export async function registrarTentativaFalha(email) {
  try {
    const ip = await obterIP()
    const { error } = await supabase
      .from('log_tentativas_login')
      .insert({ email_tentado: email || '(vazio)', ip_origem: ip })
    if (error) console.error('Erro ao registrar tentativa de login:', error)
  } catch (e) {
    console.error('Erro ao registrar tentativa de login:', e)
  }
}

// Busca as tentativas de login com falha mais recentes
export async function listarTentativasLogin(limite = 50) {
  const { data, error } = await supabase
    .from('log_tentativas_login')
    .select('*')
    .order('tentado_em', { ascending: false })
    .limit(limite)
  if (error) {
    console.error('Erro ao carregar tentativas de login:', error)
    return []
  }
  return data
}
