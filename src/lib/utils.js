import { CONFIG } from '../config.js'

// Formata um número como moeda brasileira: 2499.9 -> "R$ 2.499,90"
export function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Monta o link do WhatsApp já com a mensagem do produto preenchida
export function linkWhatsApp(produto) {
  const texto = `Olá! Tenho interesse no produto: ${produto.nome} (${formatarPreco(produto.preco)}). Ele está disponível?`
  return `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(texto)}`
}

// Link genérico do WhatsApp (usado em ícones/rodapé, sem produto específico)
export function linkWhatsAppGeral() {
  const texto = 'Olá! Gostaria de mais informações.'
  return `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(texto)}`
}

// Monta uma linha "Largura: Xcm • Altura: Ycm • Profundidade: Zcm" só com as medidas preenchidas
export function formatarMedidas(produto) {
  const partes = []
  if (produto.largura !== '' && produto.largura != null) partes.push(`Largura: ${produto.largura}cm`)
  if (produto.altura !== '' && produto.altura != null) partes.push(`Altura: ${produto.altura}cm`)
  if (produto.profundidade !== '' && produto.profundidade != null) partes.push(`Profundidade: ${produto.profundidade}cm`)
  return partes.join(' · ')
}
