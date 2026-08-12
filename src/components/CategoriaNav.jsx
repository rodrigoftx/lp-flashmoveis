export default function CategoriaNav({ categorias, categoriaAtiva, onSelecionar }) {
  return (
    <nav className="categoria-nav">
      <div className="container categoria-nav-inner">
        <button
          className={`categoria-link ${!categoriaAtiva ? 'ativo' : ''}`}
          onClick={() => onSelecionar(null, null)}
        >
          🔥 Promoções
        </button>

        {categorias.map((c) => (
          <div key={c.nome} className="categoria-dropdown">
            <button
              className={`categoria-link ${categoriaAtiva === c.nome ? 'ativo' : ''}`}
              onClick={() => onSelecionar(c.nome, null)}
            >
              {c.nome}
              {c.subs.length > 0 && <span className="categoria-seta">▾</span>}
            </button>

            {c.subs.length > 0 && (
              <div className="categoria-menu">
                {c.subs.map((s) => (
                  <button
                    key={s}
                    className="categoria-menu-item"
                    onClick={() => onSelecionar(c.nome, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
