import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'
import { obtenerId } from '../utils/recordId.js'

const labelsEstado = {
  activo: 'Activo',
  pendiente: 'Pendiente',
  invitado: 'Invitado',
}

const normalizarLista = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.friends || info.items || info.data || []
}

function FriendsList() {
  const [amigos, setAmigos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (esDemo()) {
      setAmigos(datosDemo.amigos)
      setCargando(false)
      return
    }
    let activo = true
    apiFetch('/friends')
      .then((info) => {
        if (activo) {
          setAmigos(normalizarLista(info))
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

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Amigos</p>
          <h1>Compartir agenda</h1>
          <p className="page-subtitle">
            Suma amigos para organizar grupos y seguir la misma semana.
          </p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/grupos/nuevo">
            Crear grupo
          </Link>
          <Link className="primary-btn" to="/amigos/nuevo">
            Agregar amigo
          </Link>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan="4">Cargando amigos...</td>
              </tr>
            )}
            {!cargando && amigos.length === 0 && (
              <tr>
                <td colSpan="4">No hay amigos todavia.</td>
              </tr>
            )}
            {amigos.map((amigo) => {
              const amigoId = obtenerId(amigo)
              const nombre = amigo.name || amigo.friend?.name || amigo.user?.name || 'Sin nombre'
              const email = amigo.email || amigo.friend?.email || amigo.user?.email || 'Sin email'
              const rutaDetalle = amigoId ? `/amigos/${amigoId}` : '/amigos'

              return (
                <tr key={amigoId || email}>
                  <td>{nombre}</td>
                  <td>{email}</td>
                <td>
                  <span className={`status status-${amigo.status || 'activo'}`}>
                    {labelsEstado[amigo.status] || 'Activo'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <Link className="ghost-btn small" to={rutaDetalle} state={{ amigo }}>
                      Ver
                    </Link>
                  </div>
                </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default FriendsList
