import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'

function FriendDetail() {
  const { id } = useParams()
  const ubicacion = useLocation()
  const amigoInicial = ubicacion.state?.amigo || null
  const [amigo, setAmigo] = useState(amigoInicial)
  const [cargando, setCargando] = useState(!amigoInicial)

  useEffect(() => {
    if (esDemo()) {
      const encontrado = datosDemo.amigos.find((item) => item.id === id)
      setAmigo(encontrado || null)
      setCargando(false)
      return
    }
    let activo = true
    apiFetch(`/friends/${id}`)
      .then((info) => {
        if (activo) {
          setAmigo(info.data || info.friend || info)
          setCargando(false)
        }
      })
      .catch(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  if (cargando) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Amigo</p>
            <h1>Cargando...</h1>
          </div>
        </div>
      </section>
    )
  }

  if (!amigo) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Amigo</p>
            <h1>No encontramos ese amigo</h1>
          </div>
          <div className="page-actions">
            <Link className="ghost-btn" to="/amigos">
              Volver
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const nombre = amigo.name || amigo.friend?.name || amigo.user?.name || 'Sin nombre'
  const email = amigo.email || amigo.friend?.email || amigo.user?.email || 'Sin email'
  const estado = amigo.status || amigo.friend?.status || 'activo'
  const invitacion = amigo.invitedAt || amigo.friend?.invitedAt || 'Sin datos'

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{nombre}</h1>
          <p className="page-subtitle">{email}</p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/amigos">
            Volver
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3>Info rapida</h3>
          <div className="detail-list">
            <div>
              <p className="detail-label">Estado</p>
              <p className={`status status-${estado}`}>
                {estado}
              </p>
            </div>
            <div>
              <p className="detail-label">Invitacion</p>
              <p className="detail-value">{invitacion}</p>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Acciones</h3>
          <p className="detail-text">Las acciones se gestionan desde notificaciones.</p>
          <Link className="ghost-btn" to="/notificaciones">
            Ver notificaciones
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FriendDetail
