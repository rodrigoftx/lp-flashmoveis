function IconeQualidade() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l2.3 2.2 3.1-.1.8 3 2.6 1.6-1.3 2.8 1.3 2.8-2.6 1.6-.8 3-3.1-.1L12 22l-2.3-2.2-3.1.1-.8-3-2.6-1.6 1.3-2.8-1.3-2.8 2.6-1.6.8-3 3.1.1L12 2z" />
      <path d="M8.2 12.1l2.3 2.3 5.2-5.2" />
    </svg>
  )
}

function IconeConforto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12.5V8.8a2.8 2.8 0 012.8-2.8h8.4A2.8 2.8 0 0119 8.8v3.7" />
      <path d="M4 12.5h16v4.2H4zM6 16.7v2.1M18 16.7v2.1M7 6V4.5M17 6V4.5" />
    </svg>
  )
}

function IconeDurabilidade() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l7 3v5c0 5-3 8.7-7 10-4-1.3-7-5-7-10V5l7-3z" />
      <path d="M8.5 11.8l2.2 2.2 4.7-4.7" />
    </svg>
  )
}

function IconeEntrega() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 6h11v10H3zM14 10h3l3 3v3h-6z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M1 10h5M1 13h3" />
    </svg>
  )
}

const DIFERENCIAIS = [
  { Icone: IconeQualidade, titulo: 'Qualidade', texto: 'Materiais selecionados' },
  { Icone: IconeConforto, titulo: 'Conforto', texto: 'Pensado para o seu bem-estar' },
  { Icone: IconeDurabilidade, titulo: 'Durabilidade', texto: 'Móveis que acompanham sua vida' },
  { Icone: IconeEntrega, titulo: 'Entrega rápida', texto: 'Mais comodidade para você' },
]

export default function BannerHero() {
  return (
    <section className="hero" aria-label="Flash Móveis">
      <div className="hero-fundo" style={{ backgroundImage: "url('/banner-hero.webp')" }} />
      <div className="hero-conteudo">
        <img className="hero-logo" src="/logo.png" alt="Flash Móveis" />
        <p className="hero-eyebrow">Seu lar, sua melhor escolha</p>
        <h1>
          Móveis que transformam <em>casas em lares.</em>
        </h1>
        <p className="hero-texto">
          Design, conforto e acabamento para criar ambientes que acolhem todos os momentos.
        </p>
      </div>

      <div className="beneficios" aria-label="Diferenciais Flash Móveis">
        {DIFERENCIAIS.map(({ Icone, titulo, texto }) => (
          <div className="beneficio" key={titulo}>
            <span className="beneficio-icone">
              <Icone />
            </span>
            <div>
              <strong>{titulo}</strong>
              <span>{texto}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
