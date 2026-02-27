import { Link } from 'react-router-dom'

function AuthLayout({ titulo, bajada, children: contenido, pie, variante = '' }) {
  return (
    <div className={`auth-page ${variante}`.trim()}>
      <header className="auth-top">
        <Link className="auth-logo" to="/">
          <img className="brand-logo" src="/logo.png" alt="Up Agenda logo" />
          <span>Up Agenda</span>
        </Link>
        <Link className="auth-back" to="/">
          Volver al inicio
        </Link>
      </header>

      <div className="auth-grid">
        <section className="auth-card">
          <div className="auth-header">
            <h1>{titulo}</h1>
            <p>{bajada}</p>
          </div>
          {contenido}
          {pie && <div className="auth-footer">{pie}</div>}
        </section>

        <aside className="auth-side">
          <p className="eyebrow">Agenda real</p>
          <h2>Todo tu dia en un solo panel.</h2>
          <p>
            Carga tareas, recordatorios y entregas. Ideal para llevar la cursada
            sin perderte nada.
          </p>
          <div className="auth-mini">
            <div className="auth-mini-row">
              <span className="event event-blue">Planificacion</span>
              <span className="auth-mini-time">09:30</span>
            </div>
            <div className="auth-mini-row">
              <span className="event event-green">Daily equipo</span>
              <span className="auth-mini-time">11:00</span>
            </div>
            <div className="auth-mini-row">
              <span className="event event-orange">Entrega UTN</span>
              <span className="auth-mini-time">16:00</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AuthLayout