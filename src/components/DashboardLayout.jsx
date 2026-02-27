import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { traerUsuario, borrarSesion } from '../utils/localAuth.js'
import { apiFetch } from '../services/api.js'

function DashboardLayout() {
  const navegar = useNavigate()
  const usuario = traerUsuario()
  const claseLink = ({ isActive }) => (isActive ? 'active' : '')
  const [pendientesNoti, setPendientesNoti] = useState(0)
  const [menuMobile, setMenuMobile] = useState(false)

  const salir = () => {
    borrarSesion()
    navegar('/login')
  }

  const cerrarMenu = () => {
    setMenuMobile(false)
  }

  useEffect(() => {
    apiFetch('/notifications')
      .then((info) => {
        const listaNotis = Array.isArray(info)
          ? info
          : info.notifications || info.items || info.data || []
        setPendientesNoti(listaNotis.filter((noti) => !noti.read).length)
      })
      .catch(() => setPendientesNoti(0))
  }, [])

  useEffect(() => {
    if (window.innerWidth > 768) {
      setMenuMobile(false)
    }
  }, [])

  useEffect(() => {
    if (menuMobile) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
    document.body.style.overflow = ''
    return undefined
  }, [menuMobile])

  return (
    <div className={`dashboard-layout ${menuMobile ? 'sidebar-open' : ''}`}>
      <button
        className={`dashboard-overlay ${menuMobile ? 'show' : ''}`}
        type="button"
        aria-label="Cerrar menu"
        onClick={cerrarMenu}
      />
      <aside className="sidebar">
        <Link className="sidebar-logo" to="/" onClick={cerrarMenu}>
          <img className="brand-logo" src="/logo.png" alt="Up Agenda logo" />
          <div>
            <p className="sidebar-title">Up Agenda</p>
            <p className="sidebar-subtitle">Panel principal</p>
          </div>
        </Link>

        <nav className="sidebar-nav">
          <NavLink className={claseLink} to="/dashboard" onClick={cerrarMenu}>
            Dashboard
          </NavLink>
          <NavLink className={claseLink} to="/eventos" onClick={cerrarMenu}>
            Eventos
          </NavLink>
          <NavLink className={claseLink} to="/categorias" onClick={cerrarMenu}>
            Categorias
          </NavLink>
          <NavLink className={claseLink} to="/calendario" onClick={cerrarMenu}>
            Calendario
          </NavLink>
          <NavLink className={claseLink} to="/amigos" onClick={cerrarMenu}>
            Amigos
          </NavLink>
          <NavLink className={claseLink} to="/grupos" onClick={cerrarMenu}>
            Grupos
          </NavLink>
          <NavLink className={claseLink} to="/notificaciones" onClick={cerrarMenu}>
            Notificaciones
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div>
            <p className="sidebar-user">{usuario?.name || 'Tu cuenta'}</p>
            <p className="sidebar-email">{usuario?.email || ''}</p>
          </div>
          <button className="ghost-btn small" type="button" onClick={salir}>
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-btn"
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMenuMobile(true)}
            >
              <span />
              <span />
              <span />
            </button>
            <div>
              <p className="topbar-title">Hola, {usuario?.name || 'Usuario'}</p>
              <p className="topbar-subtitle">Tu semana, bien organizada</p>
            </div>
          </div>
          <div className="topbar-actions">
            <Link className="notif-btn" to="/notificaciones" aria-label="Notificaciones">
              <svg
                className="notif-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 3.5c-2.9 0-5.25 2.35-5.25 5.25V11c0 .9-.36 1.77-1 2.41L5.2 14c-.27.27-.08.73.3.73h13c.38 0 .57-.46.3-.73l-.55-.59a3.4 3.4 0 0 1-1-2.41V8.75c0-2.9-2.35-5.25-5.25-5.25z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 18.5a2 2 0 0 0 4 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {pendientesNoti > 0 && (
                <span className="notif-badge">{pendientesNoti}</span>
              )}
            </Link>
            <label className="topbar-search">
              <span>Buscar</span>
              <input type="search" placeholder="Eventos o categorias..." />
            </label>
            <Link className="primary-btn small" to="/eventos/nuevo">
              Nuevo evento
            </Link>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout