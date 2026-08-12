import { CONFIG } from '../config.js'
import { linkWhatsAppGeral } from '../lib/utils.js'

function IconeInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

export default function Footer() {
  const horarioLinhas = CONFIG.horario.split('|').map((linha) => linha.trim())

  return (
    <footer className="footer-novo">
      <div className="container">
        <div className="footer-info">
          <img src="/logo.png" alt={CONFIG.nomeLoja} className="footer-logo" />

          <div className="footer-info-bloco">
            <h4>Fale Conosco</h4>
            <p>Whatsapp: {CONFIG.telefone}</p>
            {CONFIG.email && <p>{CONFIG.email}</p>}

            <div className="footer-icones">
              <a
                href={linkWhatsAppGeral()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Conversar no WhatsApp"
                className="footer-icone"
              >
                <IconeWhatsApp />
              </a>
              {CONFIG.instagram && (
                <a
                  href={CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram"
                  className="footer-icone"
                >
                  <IconeInstagram />
                </a>
              )}
            </div>
          </div>

          <div className="footer-info-bloco">
            <h4>Horário de atendimento</h4>
            {horarioLinhas.map((linha) => (
              <p key={linha}>{linha}</p>
            ))}
          </div>

          <div className="footer-info-bloco">
            <h4>Pagamento</h4>
            <p>{CONFIG.formasPagamento}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
