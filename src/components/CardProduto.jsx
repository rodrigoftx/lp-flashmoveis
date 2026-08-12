import { formatarPreco, linkWhatsApp } from '../lib/utils.js'

export default function CardProduto({ produto, onAbrir }) {
  return (
    <div
      className="card"
      onClick={() => onAbrir?.(produto)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onAbrir?.(produto)
      }}
    >
      <div className="card-img">
        {produto.emPromocao && <span className="card-selo">🔥 Promoção</span>}
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} />
        ) : (
          <span>🛋️</span>
        )}
      </div>
      <div className="card-corpo">
        <div className="card-nome">{produto.nome}</div>
        <div className="card-tags">
          <span className="tag">{produto.categoria}</span>
          <span className="tag tag-cor">{produto.cor}</span>
        </div>
        <div className="card-preco">{formatarPreco(produto.preco)}</div>
        <div className={`card-estoque ${produto.estoque ? 'estoque-sim' : 'estoque-nao'}`}>
          {produto.estoque ? '● Em estoque' : '● Indisponível'}
        </div>
        <a
          className="btn-whats"
          href={linkWhatsApp(produto)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Comprar pelo WhatsApp
        </a>
      </div>
    </div>
  )
}
