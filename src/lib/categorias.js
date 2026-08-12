// ============================================================
//  CATEGORIAS E SUBCATEGORIAS
//  Lidas e gravadas na tabela "categorias" do Supabase, pra que
//  a loja consiga cadastrar suas próprias categorias sem precisar
//  mexer no código.
// ============================================================

import { supabase } from './supabaseClient.js'

function daLinha(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    subs: linha.subcategorias || [],
  }
}

export async function listarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem', { ascending: true })
    .order('nome', { ascending: true })
  if (error) {
    console.error('Erro ao carregar categorias do Supabase:', error)
    return []
  }
  return data.map(daLinha)
}

export async function adicionarCategoria(nome) {
  const { data, error } = await supabase
    .from('categorias')
    .insert({ nome, subcategorias: [] })
    .select()
    .single()
  if (error) throw error
  return daLinha(data)
}

export async function renomearCategoria(id, nome) {
  const { error } = await supabase.from('categorias').update({ nome }).eq('id', id)
  if (error) throw error
}

export async function removerCategoria(id) {
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (error) throw error
}

export async function adicionarSubcategoria(id, subsAtuais, novaSub) {
  const nome = novaSub.trim()
  if (!nome || subsAtuais.includes(nome)) return subsAtuais
  const novaLista = [...subsAtuais, nome]
  const { error } = await supabase.from('categorias').update({ subcategorias: novaLista }).eq('id', id)
  if (error) throw error
  return novaLista
}

export async function removerSubcategoria(id, subsAtuais, sub) {
  const novaLista = subsAtuais.filter((s) => s !== sub)
  const { error } = await supabase.from('categorias').update({ subcategorias: novaLista }).eq('id', id)
  if (error) throw error
  return novaLista
}
