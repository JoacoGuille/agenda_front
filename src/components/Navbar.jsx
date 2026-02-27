import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <img className="brand-logo" src="/logo.png" alt="Up Agenda logo" />
        <div className="brand-text">
          <p className="brand-title">Up Agenda</p>
          <p className="brand-subtitle">Tu semana en orden</p>
        </div>
      </div>

      <nav className="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#funciona">Cómo se usa</a>
        <a href="#beneficios">Calendario</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <div className="nav-actions">
        <Link className="ghost-btn" to="/login">
          Iniciar sesión
        </Link>
        <Link className="primary-btn" to="/registro">
          Crear cuenta
        </Link>
      </div>
    </header>
  )
}

export default Navbar
