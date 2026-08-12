// ============================================================
//  UPLOAD DE IMAGENS
//  Comprime a foto no navegador e envia pro Supabase Storage,
//  retornando a URL pública pra salvar no produto.
// ============================================================

import { supabase } from './supabaseClient.js'

const BUCKET = 'produtos-imagens'
const LARGURA_MAX = 1200
const QUALIDADE = 0.82

// Redimensiona (largura máxima) e converte para WebP direto no navegador,
// pra não subir fotos gigantes de celular pro banco.
function comprimirImagem(file) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = (evento) => {
      const img = new Image()
      img.onload = () => {
        const escala = Math.min(1, LARGURA_MAX / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * escala)
        canvas.height = Math.round(img.height * escala)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao processar a imagem'))),
          'image/webp',
          QUALIDADE
        )
      }
      img.onerror = () => reject(new Error('Arquivo de imagem inválido'))
      img.src = evento.target.result
    }
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo'))
    leitor.readAsDataURL(file)
  })
}

// Envia a foto do produto pro Storage e devolve a URL pública
export async function enviarImagemProduto(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem.')
  }

  const blob = await comprimirImagem(file)
  const nomeArquivo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

  const { error } = await supabase.storage.from(BUCKET).upload(nomeArquivo, blob, {
    contentType: 'image/webp',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nomeArquivo)
  return data.publicUrl
}
