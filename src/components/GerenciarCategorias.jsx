import { useState } from 'react'
import {
  adicionarCategoria,
  renomearCategoria,
  removerCategoria,
  adicionarSubcategoria,
  removerSubcategoria,
} from '../lib/categorias.js'

export default function GerenciarCategorias({ categorias, onAtualizar, onFechar }) {
  const [novaCategoria, setNovaCategoria] = useState('')
  const [novaSub, setNovaSub] = useState({}) // { [categoriaId]: texto digitado }
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function criarCategoria() {
    const nome = novaCategoria.trim()
    if (!nome) return
    setSalvando(true)
    setErro('')
    try {
      await adicionarCategoria(nome)
      setNovaCategoria('')
      await onAtualizar()
    } catch (e) {
      setErro('Não foi possível criar (talvez já exista uma categoria com esse nome).')
    } finally {
      setSalvando(false)
    }
  }

  async function excluirCategoria(cat) {
    if (!confirm(`Excluir a categoria "${cat.nome}" e todas as suas subcategorias?`)) return
    await removerCategoria(cat.id)
    await onAtualizar()
  }

  async function criarSubcategoria(cat) {
    const texto = (novaSub[cat.id] || '').trim()
    if (!texto) return
    await adicionarSubcategoria(cat.id, cat.subs, texto)
    setNovaSub((s) => ({ ...s, [cat.id]: '' }))
    await onAtualizar()
  }

  async function excluirSubcategoria(cat, sub) {
    await removerSubcategoria(cat.id, cat.subs, sub)
    await onAtualizar()
  }

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal modal-largo" onClick={(e) => e.stopPropagation()}>
        <h3>Gerenciar categorias</h3>

        <div className="campo">
          <label>Nova categoria</label>
          <div className="campo-linha">
            <input
              value={novaCategoria}
              placeholder="Ex: Iluminação"
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && criarCategoria()}
            />
            <button className="btn-primario" style={{ width: 'auto', padding: '10px 18px' }} onClick={criarCategoria} disabled={salvando}>
              + Adicionar
            </button>
          </div>
          {erro && <p className="erro">{erro}</p>}
        </div>

        <div className="log-lista" style={{ marginTop: 8 }}>
          {categorias.length === 0 ? (
            <p className="vazio">Nenhuma categoria cadastrada ainda.</p>
          ) : (
            categorias.map((cat) => (
              <div key={cat.id} className="log-linha">
                <div className="log-linha-topo">
                  <strong>{cat.nome}</strong>
                  <button
                    className="btn-icone"
                    style={{ padding: '4px 10px', fontSize: 12 }}
                    onClick={() => excluirCategoria(cat)}
                  >
                    Excluir categoria
                  </button>
                </div>

                <div className="sub-tags">
                  {cat.subs.map((s) => (
                    <span key={s} className="sub-tag">
                      {s}
                      <button onClick={() => excluirSubcategoria(cat, s)} aria-label={`Remover ${s}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="campo-linha" style={{ marginTop: 8 }}>
                  <input
                    placeholder="Nova subcategoria..."
                    value={novaSub[cat.id] || ''}
                    onChange={(e) => setNovaSub((s) => ({ ...s, [cat.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && criarSubcategoria(cat)}
                  />
                  <button className="btn-icone" onClick={() => criarSubcategoria(cat)}>
                    + Sub
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-acoes">
          <button className="btn-cancelar" onClick={onFechar}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
