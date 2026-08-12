import { useState, useEffect } from 'react'
import { formatarPreco, linkWhatsApp, formatarMedidas } from '../lib/utils.js'

export default function DetalheProduto({ produto, onFechar }) {
  const [ativa, setAtiva] = useState(0)

  useEffect(() => {
    setAtiva(0)
  }, [produto])

  if (!produto) return null

  const medidas = formatarMedidas(produto)
  const imagens = produto.imagens?.length ? produto.imagens : produto.imagem ? [produto.imagem] : []

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal modal-produto" onClick={(e) => e.stopPropagation()}>
        <button className="detalhe-fechar" onClick={onFechar} aria-label="Fechar">
          ✕
        </button>

        <div className="detalhe-img">
          {imagens.length > 0 ? (
            <img src={imagens[ativa]} alt={produto.nome} />
          ) : (
            <span>🛋️</span>
          )}
        </div>

        {imagens.length > 1 && (
          <div className="detalhe-miniaturas">
            {imagens.map((url, i) => (
              <button
                key={url + i}
                className={`detalhe-miniatura ${i === ativa ? 'ativa' : ''}`}
                onClick={() => setAtiva(i)}
              >
                <img src={url} alt={`${produto.nome} ${i + 1}`} />
              </button>
            ))}
          </div>
        )}

        <h3>{produto.nome}</h3>

        <div className="card-tags detalhe-tags">
          <span className="tag">{produto.categoria}</span>
          {produto.subcategoria && <span className="tag">{produto.subcategoria}</span>}
          <span className="tag tag-cor">{produto.cor}</span>
        </div>

        <div className="card-preco detalhe-preco">{formatarPreco(produto.preco)}</div>

        <div className={`card-estoque detalhe-estoque ${produto.estoque ? 'estoque-sim' : 'estoque-nao'}`}>
          {produto.estoque ? '● Em estoque' : '● Indisponível'}
        </div>

        {produto.descricao && <p className="detalhe-descricao">{produto.descricao}</p>}

        {medidas && <p className="detalhe-medidas">📐 {medidas}</p>}

        <a
          className="btn-whats detalhe-btn-whats"
          href={linkWhatsApp(produto)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Comprar pelo WhatsApp
        </a>
      </div>
    </div>
  )
}
