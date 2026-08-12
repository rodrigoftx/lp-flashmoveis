import { useEffect, useState } from 'react'
import { listarLogs } from '../lib/logs.js'

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LogAtividades({ onFechar }) {
  const [logs, setLogs] = useState(null)

  useEffect(() => {
    listarLogs().then(setLogs)
  }, [])

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal modal-largo" onClick={(e) => e.stopPropagation()}>
        <h3>Histórico de atividades</h3>

        {logs === null ? (
          <p className="vazio">Carregando...</p>
        ) : logs.length === 0 ? (
          <p className="vazio">Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className="log-lista">
            {logs.map((l) => (
              <div key={l.id} className="log-linha">
                <div className="log-linha-topo">
                  <strong>{l.acao}</strong>
                  <span className="log-data">{formatarData(l.criado_em)}</span>
                </div>
                <div className="log-linha-detalhe">
                  {l.usuario_email} · {l.produto_nome || `produto #${l.produto_id}`}
                  {l.detalhe ? ` · ${l.detalhe}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-acoes">
          <button className="btn-cancelar" onClick={onFechar}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
