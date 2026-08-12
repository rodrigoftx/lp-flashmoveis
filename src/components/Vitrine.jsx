import { useState, useMemo } from 'react'
import CardProduto from './CardProduto.jsx'
import DetalheProduto from './DetalheProduto.jsx'
import { CORES } from '../data/produtos.js'

export default function Vitrine({
  produtos,
  busca,
  setBusca,
  categoriaFixa = null,
  subcategoriaFixa = null,
  aoVerTodos,
}) {
  const [cor, setCor] = useState('')
  const [soEstoque, setSoEstoque] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  const filtrados = useMemo(() => {
    // Tela inicial: mostra só os produtos marcados como "em promoção"
    if (!categoriaFixa) {
      return produtos.filter((p) => p.emPromocao)
    }

    const termo = busca.trim().toLowerCase()
    return produtos.filter((p) => {
      if (p.categoria !== categoriaFixa) return false
      if (subcategoriaFixa && p.subcategoria !== subcategoriaFixa) return false
      if (cor && !(p.cores?.length ? p.cores : [p.cor]).includes(cor)) return false
      if (soEstoque && !p.estoque) return false
      if (termo && !p.nome.toLowerCase().includes(termo)) return false
      return true
    })
  }, [produtos, categoriaFixa, subcategoriaFixa, cor, soEstoque, busca])

  return (
    <>
      <div className="container categoria-titulo">
        <h2>
          {categoriaFixa
            ? `${categoriaFixa}${subcategoriaFixa ? ` · ${subcategoriaFixa}` : ''}`
            : '🔥 Produtos em Promoção'}
        </h2>
        {categoriaFixa && (
          <button className="btn-icone" onClick={aoVerTodos}>
            ← Ver promoções
          </button>
        )}
      </div>

      {categoriaFixa && (
        <div className="filtros">
          <div className="container filtros-inner">
            <div className="filtros-busca">
              <input
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <label>Cor:</label>
            <select value={cor} onChange={(e) => setCor(e.target.value)}>
              <option value="">Todas</option>
              {CORES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="check-inline">
              <input
                type="checkbox"
                checked={soEstoque}
                onChange={(e) => setSoEstoque(e.target.checked)}
              />
              Só em estoque
            </label>
          </div>
        </div>
      )}

      <div className="container">
        <div className="grade">
          {filtrados.length === 0 ? (
            <p className="vazio">
              {categoriaFixa
                ? 'Nenhum produto encontrado com esses filtros.'
                : 'Nenhum produto em promoção no momento.'}
            </p>
          ) : (
            filtrados.map((p) => (
              <CardProduto key={p.id} produto={p} onAbrir={setProdutoSelecionado} />
            ))
          )}
        </div>
      </div>

      <DetalheProduto produto={produtoSelecionado} onFechar={() => setProdutoSelecionado(null)} />
    </>
  )
}
