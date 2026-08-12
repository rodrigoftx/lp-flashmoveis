// ============================================================
//  CAMADA DE DADOS (store)
//
//  Este é o ÚNICO arquivo que fala com o banco de dados. Todo o
//  resto do site chama estas funções sem saber de onde os dados
//  vêm. Hoje elas leem e gravam na tabela "produtos" do Supabase.
// ============================================================

import { supabase } from './supabaseClient.js'
import { registrarLog } from './logs.js'

// Cache local da última lista carregada — usada pelas funções de
// alternar (estoque/promoção) para saber o valor atual sem precisar
// buscar o produto de novo no banco.
let produtos = []

// Converte uma linha do banco (snake_case) para o formato usado no site
function daLinha(linha) {
  const imagens = linha.imagens && linha.imagens.length ? linha.imagens : linha.imagem ? [linha.imagem] : []
  return {
    id: linha.id,
    nome: linha.nome,
    categoria: linha.categoria,
    subcategoria: linha.subcategoria || '',
    cor: linha.cor || '',
    preco: Number(linha.preco),
    estoque: linha.estoque,
    emPromocao: linha.em_promocao,
    imagens,
    imagem: imagens[0] || '', // capa — mantida por compatibilidade (card, WhatsApp, etc.)
    descricao: linha.descricao || '',
    largura: linha.largura ?? '',
    altura: linha.altura ?? '',
    profundidade: linha.profundidade ?? '',
  }
}

// Converte os dados do formulário do site para o formato da tabela
function paraLinha(dados) {
  const imagens = dados.imagens || []
  return {
    nome: dados.nome,
    categoria: dados.categoria,
    subcategoria: dados.subcategoria || null,
    cor: dados.cor || null,
    preco: dados.preco,
    estoque: dados.estoque,
    em_promocao: dados.emPromocao,
    imagens,
    imagem: imagens[0] || '', // capa — mantida por compatibilidade (card, WhatsApp, etc.)
    descricao: dados.descricao || '',
    largura: dados.largura === '' ? null : dados.largura,
    altura: dados.altura === '' ? null : dados.altura,
    profundidade: dados.profundidade === '' ? null : dados.profundidade,
  }
}

// --- Funções públicas (a "API" que o site usa) ---

export async function listarProdutos() {
  const { data, error } = await supabase.from('produtos').select('*').order('id')
  if (error) {
    console.error('Erro ao carregar produtos do Supabase:', error)
    return produtos
  }
  produtos = data.map(daLinha)
  return produtos
}

export async function adicionarProduto(dados) {
  const { data, error } = await supabase
    .from('produtos')
    .insert(paraLinha(dados))
    .select()
    .single()
  if (error) {
    console.error('Erro ao adicionar produto no Supabase:', error)
    return null
  }
  const novo = daLinha(data)
  registrarLog('Criou produto', novo)
  return novo
}

export async function atualizarProduto(id, dados) {
  const { error } = await supabase.from('produtos').update(paraLinha(dados)).eq('id', id)
  if (error) {
    console.error('Erro ao atualizar produto no Supabase:', error)
    return
  }
  registrarLog('Editou produto', { id, nome: dados.nome })
}

export async function removerProduto(id) {
  const atual = produtos.find((p) => p.id === id)
  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) {
    console.error('Erro ao remover produto no Supabase:', error)
    return
  }
  registrarLog('Excluiu produto', atual || { id })
}

export async function alternarEstoque(id) {
  const atual = produtos.find((p) => p.id === id)
  if (!atual) return
  const { error } = await supabase
    .from('produtos')
    .update({ estoque: !atual.estoque })
    .eq('id', id)
  if (error) {
    console.error('Erro ao alternar estoque no Supabase:', error)
    return
  }
  registrarLog('Alterou estoque', atual, !atual.estoque ? 'Em estoque' : 'Fora de estoque')
}

export async function alternarPromocao(id) {
  const atual = produtos.find((p) => p.id === id)
  if (!atual) return
  const { error } = await supabase
    .from('produtos')
    .update({ em_promocao: !atual.emPromocao })
    .eq('id', id)
  if (error) {
    console.error('Erro ao alternar promoção no Supabase:', error)
    return
  }
  registrarLog('Alterou promoção', atual, !atual.emPromocao ? 'Em promoção' : 'Fora de promoção')
}
