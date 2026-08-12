import { useState, useMemo, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { formatarPreco } from '../lib/utils.js'
import { registrarTentativaFalha } from '../lib/logs.js'
import ModalProduto from './ModalProduto.jsx'
import LogAtividades from './LogAtividades.jsx'
import GerenciarCategorias from './GerenciarCategorias.jsx'

export default function Admin({ produtos, acoes, categorias, onAtualizarCategorias }) {
  const [sessao, setSessao] = useState(undefined) // undefined = verificando | null = deslogado | objeto = logado
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [modal, setModal] = useState(null) // null | 'novo' | produto
  const [busca, setBusca] = useState('')
  const [mostrarLog, setMostrarLog] = useState(false)
  const [mostrarCategorias, setMostrarCategorias] = useState(false)

  // Verifica se já existe uma sessão ativa e escuta mudanças de login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessao(data.session))
    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, session) => {
      setSessao(session)
    })
    return () => assinatura.subscription.unsubscribe()
  }, [])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return produtos
    return produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo) ||
        (p.cores || []).some((c) => c.toLowerCase().includes(termo))
    )
  }, [produtos, busca])

  async function entrar() {
    setEntrando(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('E-mail ou senha incorretos.')
      registrarTentativaFalha(email)
    }
    setEntrando(false)
  }

  function sair() {
    supabase.auth.signOut()
  }

  function salvar(dados) {
    if (modal && modal !== 'novo') {
      acoes.atualizar(modal.id, dados)
    } else {
      acoes.adicionar(dados)
    }
    setModal(null)
  }

  if (sessao === undefined) {
    return (
      <div className="admin-fundo">
        <div className="container">
          <p className="vazio">Verificando login...</p>
        </div>
      </div>
    )
  }

  if (!sessao) {
    return (
      <div className="admin-fundo">
        <div className="container">
          <div className="login-box">
            <h2>Acesso ao gerenciamento</h2>
            <p className="sub">Área restrita à equipe da loja.</p>
            <div className="campo">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@flashmoveis.com.br"
              />
            </div>
            <div className="campo">
              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && entrar()}
                placeholder="••••"
              />
            </div>
            <button className="btn-primario" onClick={entrar} disabled={entrando}>
              {entrando ? 'Entrando...' : 'Entrar'}
            </button>
            {erro && <p className="erro">{erro}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-fundo">
      <div className="container">
        <div className="admin-topo">
          <h2>Gerenciar produtos ({produtos.length})</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-novo" onClick={() => setModal('novo')}>
              + Novo produto
            </button>
            <button className="btn-icone" onClick={() => setMostrarCategorias(true)}>
              Categorias
            </button>
            <button className="btn-icone" onClick={() => setMostrarLog(true)}>
              Histórico
            </button>
            <button className="btn-icone" onClick={sair} title={sessao.user?.email}>
              Sair
            </button>
          </div>
        </div>

        <div className="admin-busca">
          <input
            placeholder="Buscar por nome, categoria ou cor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {filtrados.length === 0 ? (
          <p className="vazio">Nenhum produto encontrado com essa busca.</p>
        ) : (
          filtrados.map((p) => (
            <div key={p.id} className="linha-produto">
              <div className="linha-info">
                <div className="nome">{p.nome}</div>
                <div className="meta">
                  {p.categoria} · {(p.cores || []).join(', ') || '—'} · {formatarPreco(p.preco)}
                </div>
              </div>
              <button
                className={`pill ${p.estoque ? 'pill-sim' : 'pill-nao'}`}
                onClick={() => acoes.alternarEstoque(p.id)}
                title="Clique para alternar"
              >
                {p.estoque ? 'Em estoque' : 'Fora de estoque'}
              </button>
              <button
                className={`pill ${p.emPromocao ? 'pill-sim' : 'pill-nao'}`}
                onClick={() => acoes.alternarPromocao(p.id)}
                title="Clique para alternar"
              >
                {p.emPromocao ? '🔥 Em promoção' : 'Fora de promoção'}
              </button>
              <button className="btn-icone" onClick={() => setModal(p)}>
                Editar
              </button>
              <button
                className="btn-icone"
                onClick={() => {
                  if (confirm(`Excluir "${p.nome}"?`)) acoes.remover(p.id)
                }}
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      {modal && (
        <ModalProduto
          produto={modal === 'novo' ? null : modal}
          categorias={categorias}
          onSalvar={salvar}
          onFechar={() => setModal(null)}
        />
      )}

      {mostrarLog && <LogAtividades onFechar={() => setMostrarLog(false)} />}

      {mostrarCategorias && (
        <GerenciarCategorias
          categorias={categorias}
          onAtualizar={onAtualizarCategorias}
          onFechar={() => setMostrarCategorias(false)}
        />
      )}
    </div>
  )
}
