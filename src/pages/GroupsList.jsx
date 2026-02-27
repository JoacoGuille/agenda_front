import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

const normalizarLista = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.groups || info.items || info.data || []
}

function GroupsList() {
  const [grupos, setGrupos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    apiFetch('/groups')
      .then((info) => {
        if (activo) {
          setGrupos(normalizarLista(info))
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
          <p className="eyebrow">Grupos</p>
          <h1>Agenda en equipo</h1>
          <p className="page-subtitle">
            Arma grupos para compartir la misma semana.
          </p>
        </div>
        <div className="page-actions">
          <Link className="primary-btn" to="/grupos/nuevo">
            Crear grupo
          </Link>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Miembros</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan="4">Cargando grupos...</td>
              </tr>
            )}
            {!cargando && grupos.length === 0 && (
              <tr>
                <td colSpan="4">No hay grupos todavia.</td>
              </tr>
            )}
            {grupos.map((grupo) => (
              <tr key={grupo.id}>
                <td>{grupo.name}</td>
                <td>{grupo.membersCount ?? grupo.members?.length ?? 0}</td>
                <td>
                  <span className={`status status-${grupo.status || 'activo'}`}>
                    {grupo.status || 'activo'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <Link className="ghost-btn small" to={`/grupos/${grupo.id}`}>
                      Ver
                    </Link>
                    <Link className="ghost-btn small" to={`/grupos/${grupo.id}/editar`}>
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default GroupsList