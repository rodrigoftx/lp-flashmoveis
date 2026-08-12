import { useState } from 'react'
import { CORES } from '../data/produtos.js'
import { enviarImagemProduto } from '../lib/upload.js'

const VAZIO = {
  nome: '',
  categoria: '',
  subcategoria: '',
  cores: [],
  preco: '',
  estoque: true,
  emPromocao: false,
  imagens: [],
  descricao: '',
  largura: '',
  altura: '',
  profundidade: '',
}

export default function ModalProduto({ produto, categorias, onSalvar, onFechar }) {
  const inicial = produto
    ? { ...VAZIO, ...produto }
    : { ...VAZIO, categoria: categorias[0]?.nome || '' }
  const [form, setForm] = useState(inicial)
  const [enviando, setEnviando] = useState(false)
  const [erroUpload, setErroUpload] = useState('')

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  function alternarCor(cor) {
    setForm((f) => ({
      ...f,
      cores: f.cores.includes(cor) ? f.cores.filter((c) => c !== cor) : [...f.cores, cor],
    }))
  }

  async function selecionarArquivos(e) {
    const arquivos = Array.from(e.target.files || [])
    if (!arquivos.length) return
    setErroUpload('')
    setEnviando(true)
    try {
      const urls = await Promise.all(arquivos.map((arquivo) => enviarImagemProduto(arquivo)))
      setForm((f) => ({ ...f, imagens: [...f.imagens, ...urls] }))
    } catch (err) {
      setErroUpload(err.message || 'Erro ao enviar a imagem.')
    } finally {
      setEnviando(false)
      e.target.value = ''
    }
  }

  function removerImagem(indice) {
    setForm((f) => ({ ...f, imagens: f.imagens.filter((_, i) => i !== indice) }))
  }

  function tornarCapa(indice) {
    setForm((f) => {
      const imagens = [...f.imagens]
      const [escolhida] = imagens.splice(indice, 1)
      return { ...f, imagens: [escolhida, ...imagens] }
    })
  }

  function salvar() {
    onSalvar({
      ...form,
      nome: form.nome.trim() || 'Sem nome',
      preco: parseFloat(form.preco) || 0,
      descricao: form.descricao.trim(),
      largura: form.largura !== '' ? parseFloat(form.largura) : '',
      altura: form.altura !== '' ? parseFloat(form.altura) : '',
      profundidade: form.profundidade !== '' ? parseFloat(form.profundidade) : '',
    })
  }

  const subs = categorias.find((c) => c.nome === form.categoria)?.subs || []

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{produto ? 'Editar produto' : 'Novo produto'}</h3>

        <div className="campo">
          <label>Nome</label>
          <input value={form.nome} onChange={(e) => set('nome', e.target.value)} />
        </div>

        <div className="campo">
          <label>Categoria</label>
          {categorias.length === 0 ? (
            <p className="vazio" style={{ padding: 0 }}>
              Nenhuma categoria cadastrada. Feche este formulário e crie uma em "Categorias".
            </p>
          ) : (
            <select
              value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value, subcategoria: '' }))}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cor-borda)', borderRadius: 'var(--raio)', fontSize: 14 }}
            >
              {categorias.map((c) => (
                <option key={c.nome}>{c.nome}</option>
              ))}
            </select>
          )}
        </div>

        <div className="campo">
          <label>Subcategoria</label>
          <select
            value={form.subcategoria}
            onChange={(e) => set('subcategoria', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cor-borda)', borderRadius: 'var(--raio)', fontSize: 14 }}
          >
            <option value="">—</option>
            {subs.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Cores (selecione uma ou mais)</label>
          <div className="cores-selecao">
            {CORES.map((c) => (
              <label key={c} className={`cor-opcao ${form.cores.includes(c) ? 'selecionada' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.cores.includes(c)}
                  onChange={() => alternarCor(c)}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="campo">
          <label>Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            value={form.preco}
            onChange={(e) => set('preco', e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Descrição</label>
          <textarea
            value={form.descricao}
            placeholder="Detalhes, observações e características do produto..."
            onChange={(e) => set('descricao', e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Medidas (cm)</label>
          <div className="campo-linha">
            <input
              type="number"
              step="0.1"
              placeholder="Largura"
              value={form.largura}
              onChange={(e) => set('largura', e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Altura"
              value={form.altura}
              onChange={(e) => set('altura', e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Profundidade"
              value={form.profundidade}
              onChange={(e) => set('profundidade', e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label>Fotos do produto</label>
          <div className="upload-imagem">
            {form.imagens.length > 0 && (
              <div className="upload-grade">
                {form.imagens.map((url, i) => (
                  <div className="upload-item" key={url + i}>
                    <div className="upload-preview">
                      <img src={url} alt={`Foto ${i + 1}`} />
                      {i === 0 && <span className="upload-capa-selo">Capa</span>}
                    </div>
                    <div className="upload-item-acoes">
                      {i !== 0 && (
                        <button type="button" onClick={() => tornarCapa(i)}>
                          Tornar capa
                        </button>
                      )}
                      <button type="button" onClick={() => removerImagem(i)}>
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label className="upload-botao">
              {enviando ? 'Enviando...' : '📷 Adicionar fotos do computador'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={selecionarArquivos}
                disabled={enviando}
              />
            </label>
            {erroUpload && <p className="erro">{erroUpload}</p>}
          </div>
        </div>

        <label className="check-inline" style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={form.estoque}
            onChange={(e) => set('estoque', e.target.checked)}
          />
          Produto em estoque
        </label>

        <label className="check-inline" style={{ marginBottom: 18 }}>
          <input
            type="checkbox"
            checked={form.emPromocao}
            onChange={(e) => set('emPromocao', e.target.checked)}
          />
          🔥 Produto em promoção (aparece na tela inicial)
        </label>

        <div className="modal-acoes">
          <button className="btn-primario" onClick={salvar}>
            Salvar
          </button>
          <button className="btn-cancelar" onClick={onFechar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
