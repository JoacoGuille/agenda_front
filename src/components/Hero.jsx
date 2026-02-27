import { Link, useNavigate } from 'react-router-dom'
import CalendarPreview from './CalendarPreview.jsx'

function Hero() {
  const irA = useNavigate()

  const irLogin = () => {
    irA('/login')
  }

  return (
    <section id="inicio" className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Proyecto integrador UTN</p>
        <h1>Tu agenda semanal, al dia y sin vueltas.</h1>
        <p className="lead">
          Cursada, laburo y vida personal en un solo panel. Organiza clases,
          entregas, reuniones y recordatorios con vista semanal clara.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" type="button" onClick={irLogin}>
            Ir a login
          </button>
          <Link className="ghost-btn" to="/endpoints">
            Ver endpoints
          </Link>
        </div>
        <div className="hero-meta">
          <div>
            <p className="meta-value">7 dias</p>
            <p className="meta-label">Vista semanal</p>
          </div>
          <div>
            <p className="meta-value">24/7</p>
            <p className="meta-label">Recordatorios</p>
          </div>
          <div>
            <p className="meta-value">1 panel</p>
            <p className="meta-label">Todo en un lugar</p>
          </div>
        </div>
      </div>

      <CalendarPreview />
    </section>
  )
}

export default Hero