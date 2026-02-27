import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

const normalizarLista = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.notifications || info.items || info.data || []
}

function Notifications() {
  const [notis, setNotis] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    apiFetch('/notifications')
      .then((info) => {
        if (activo) {
          setNotis(normalizarLista(info))
          setCargando(false)
        }
      })
      .catch(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const resolverNoti = async (id, accion) => {
    try {
      await apiFetch(`/notifications/${id}/${accion}`, { method: 'POST' })
      setNotis((previas) => previas.filter((item) => item.id !== id))
    } catch {
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Notificaciones</p>
          <h1>Solicitudes pendientes</h1>
          <p className="page-subtitle">
            Acepta o rechaza invitaciones para compartir tu agenda.
          </p>
        </div>
        <div className="page-actions">
          <Link className="primary-btn" to="/amigos">
            Ver amigos
          </Link>
        </div>
      </div>

      <ul className="notification-list">
        {cargando && <li className="notification-item">Cargando...</li>}
        {!cargando && notis.length === 0 && (
          <li className="notification-item">No hay notificaciones.</li>
        )}
        {notis.map((noti) => (
          <li
            key={noti.id}
            className={`notification-item ${noti.read ? '' : 'notification-item--new'}`}
          >
            <div className="notification-info">
              <p className="notification-title">{noti.title || 'Notificacion'}</p>
              <p className="notification-text">{noti.message || ''}</p>
              <span className="notification-date">{noti.createdAt || ''}</span>
            </div>
            <div className="notification-actions">
              <button
                className="ghost-btn small"
                type="button"
                onClick={() => resolverNoti(noti.id, 'reject')}
              >
                Rechazar
              </button>
              <button
                className="primary-btn small"
                type="button"
                onClick={() => resolverNoti(noti.id, 'accept')}
              >
                Aceptar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Notifications