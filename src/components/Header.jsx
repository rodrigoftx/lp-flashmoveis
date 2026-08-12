import { CONFIG } from '../config.js'

export default function Header({ pagina, setPagina }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-marca">
          <img src="/logo.png" alt={CONFIG.nomeLoja} className="header-logo" />
          <div>
            <h1>{CONFIG.nomeLoja}</h1>
            <div className="slogan">{CONFIG.slogan}</div>
          </div>
        </div>

        <button
          className="btn-admin"
          onClick={() => setPagina(pagina === 'admin' ? 'loja' : 'admin')}
        >
          {pagina === 'admin' ? '← Voltar à loja' : '🔒 Área do administrador'}
        </button>
      </div>
    </header>
  )
}
