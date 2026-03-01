import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'
import { obtenerId } from '../utils/recordId.js'

function GroupDetail() {
  const { id } = useParams()
  const ubicacion = useLocation()
  const grupoInicial = ubicacion.state?.grupo || null
  const [grupo, setGrupo] = useState(grupoInicial)
  const [linkInvitacion, setLinkInvitacion] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [cargando, setCargando] = useState(!grupoInicial)

  useEffect(() => {
    if (esDemo()) {
      const encontrado = datosDemo.grupos.find((item) => item.id === id)
      setGrupo(encontrado || null)
      setCargando(false)
      return
    }
    let activo = true
    apiFetch(`/groups/${id}`)
      .then((info) => {
        if (activo) {
          setGrupo(info.data || info.group || info)
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
    if (esDemo()) {
      setLinkInvitacion('https://upagenda.demo/invite/TP-Sistemas')
      setCopiado(false)
      return
    }
    try {
      const info = await apiFetch(`/groups/${id}/invite-link`, { method: 'POST' })
      const link = info.link || info.inviteLink || info.url
      if (link) {
        setLinkInvitacion(link)
        setCopiado(false)
      }
    } catch {
      setLinkInvitacion('No se pudo generar el link.')
      setCopiado(false)
    }
  }

  const copiarLink = async () => {
    if (!linkInvitacion || !linkInvitacion.startsWith('http')) return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(linkInvitacion)
      } else {
        const input = document.createElement('textarea')
        input.value = linkInvitacion
        input.setAttribute('readonly', '')
        input.style.position = 'absolute'
        input.style.left = '-9999px'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      setCopiado(false)
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

  const miembros = grupo.members || grupo.users || grupo.group?.members || []
  const nombre = grupo.name || grupo.group?.name || 'Grupo'
  const descripcion = grupo.description || grupo.group?.description || 'Sin descripcion'
  const grupoId = obtenerId(grupo) || id
  const linkValido = linkInvitacion && linkInvitacion.startsWith('http')

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{nombre}</h1>
          <p className="page-subtitle">{descripcion}</p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/grupos">
            Volver
          </Link>
          <Link className="primary-btn" to={`/grupos/${grupoId}/editar`} state={{ grupo }}>
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
              {miembros.map((miembro, index) => {
                const nombre =
                  miembro?.name ||
                  miembro?.user?.name ||
                  miembro?.profile?.name ||
                  miembro?.member?.name ||
                  (typeof miembro === 'string' ? 'Miembro' : 'Sin nombre')
                const email =
                  miembro?.email ||
                  miembro?.user?.email ||
                  miembro?.profile?.email ||
                  miembro?.member?.email ||
                  (typeof miembro === 'string' ? miembro : 'Sin email')
                const key = obtenerId(miembro) || email || `${nombre}-${index}`

                return (
                  <li key={key} className="panel-item">
                    <div>
                      <p className="panel-title">{nombre}</p>
                      <p className="panel-subtitle">{email}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="panel">
          <h3>Compartir</h3>
          <p className="detail-text">Link rapido para invitar gente nueva a este grupo.</p>
          <button className="ghost-btn" type="button" onClick={generarLink}>
            Generar link
          </button>
          {linkValido && (
            <button className="primary-btn small" type="button" onClick={copiarLink}>
              {copiado ? 'Copiado' : 'Copiar link'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default GroupDetail
