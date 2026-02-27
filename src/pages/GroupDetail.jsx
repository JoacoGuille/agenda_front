import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

function GroupDetail() {
  const { id } = useParams()
  const [grupo, setGrupo] = useState(null)
  const [linkInvitacion, setLinkInvitacion] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    apiFetch(`/groups/${id}`)
      .then((info) => {
        if (activo) {
          setGrupo(info.data || info)
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

  const generarLink = async () => {
    try {
      const info = await apiFetch(`/groups/${id}/invite-link`, { method: 'POST' })
      const link = info.link || info.inviteLink || info.url
      if (link) setLinkInvitacion(link)
    } catch {
      setLinkInvitacion('No se pudo generar el link.')
    }
  }

  if (cargando) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Grupo</p>
            <h1>Cargando...</h1>
          </div>
        </div>
      </section>
    )
  }

  if (!grupo) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Grupo</p>
            <h1>No encontramos ese grupo</h1>
          </div>
          <div className="page-actions">
            <Link className="ghost-btn" to="/grupos">
              Volver
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const miembros = grupo.members || []

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{grupo.name}</h1>
          <p className="page-subtitle">{grupo.description || 'Sin descripcion'}</p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/grupos">
            Volver
          </Link>
          <Link className="primary-btn" to={`/grupos/${grupo.id}/editar`}>
            Editar grupo
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3>Miembros</h3>
          {miembros.length === 0 ? (
            <p className="detail-text">Todavia no hay miembros.</p>
          ) : (
            <ul className="panel-list">
              {miembros.map((miembro) => (
                <li key={miembro.id || miembro.email} className="panel-item">
                  <div>
                    <p className="panel-title">{miembro.name}</p>
                    <p className="panel-subtitle">{miembro.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h3>Compartir</h3>
          <p className="detail-text">Link rapido para invitar gente nueva a este grupo.</p>
          <button className="ghost-btn" type="button" onClick={generarLink}>
            Generar link
          </button>
          {linkInvitacion && <p className="detail-text">{linkInvitacion}</p>}
        </div>
      </div>
    </section>
  )
}

export default GroupDetail