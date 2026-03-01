import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { haySesion } from '../utils/localAuth.js'

const URL_API = import.meta.env.VITE_API_URL

function GroupJoin() {
  const ubicacion = useLocation()
  const irA = useNavigate()
  const params = new URLSearchParams(ubicacion.search)
  const token = params.get('token')
  const groupId = params.get('groupId')

  const [grupo, setGrupo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')
  const [noEncontrado, setNoEncontrado] = useState(false)
  const [uniendo, setUniendo] = useState(false)

  useEffect(() => {
    if (!token || !groupId) {
      setMensajeError('El link es invalido o esta incompleto.')
      setCargando(false)
      return
    }

    let activo = true
    const validar = async () => {
      try {
        const url = `${URL_API}/groups/join?token=${encodeURIComponent(
          token,
        )}&groupId=${encodeURIComponent(groupId)}`
        const respuesta = await fetch(url)
        let data = null
        try {
          data = await respuesta.json()
        } catch {
          data = null
        }
        if (!activo) return
        if (respuesta.ok) {
          setGrupo(data?.group || data?.data || data)
          setNoEncontrado(false)
          setMensajeError('')
        } else if (respuesta.status === 404) {
          setNoEncontrado(true)
        } else {
          setMensajeError(data?.message || 'No se pudo validar la invitacion.')
        }
      } catch {
        if (!activo) return
        setMensajeError('No se pudo validar la invitacion.')
      } finally {
        if (activo) setCargando(false)
      }
    }

    validar()
    return () => {
      activo = false
    }
  }, [token, groupId])

  const unirse = async () => {
    if (!haySesion()) {
      setMensajeError('Inicia sesion para unirte al grupo.')
      return
    }
    if (!token || !groupId) return
    setMensajeError('')
    setMensajeOk('')
    setUniendo(true)
    try {
      await apiFetch('/groups/join', {
        method: 'POST',
        body: JSON.stringify({ token, groupId }),
      })
      setMensajeOk('Listo. Ya sos parte del grupo.')
      setTimeout(() => irA(`/grupos/${groupId}`), 900)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo completar la invitacion.')
    } finally {
      setUniendo(false)
    }
  }

  const nombre = grupo?.name || grupo?.group?.name || 'Grupo'
  const descripcion = grupo?.description || grupo?.group?.description || 'Sin descripcion'
  const miembros =
    grupo?.membersCount ??
    grupo?.members?.length ??
    grupo?.group?.membersCount ??
    grupo?.group?.members?.length ??
    0

  if (cargando) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Invitacion</p>
            <h1>Validando link...</h1>
          </div>
        </div>
      </section>
    )
  }

  if (noEncontrado) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Invitacion</p>
            <h1>No encontramos ese grupo</h1>
          </div>
          <div className="page-actions">
            <Link className="ghost-btn" to="/">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page join-page">
      <div className="join-shell">
        <div className="join-hero">
          <div>
            <p className="eyebrow">Invitacion</p>
            <h1>Unite al grupo</h1>
            <p className="join-subtitle">
              Confirmamos el link. Si queres, podes unirte ahora.
            </p>
          </div>
          <div className="join-actions">
            <Link className="ghost-btn" to="/">
              Volver
            </Link>
          </div>
        </div>

        <div className="join-grid">
          <article className="join-card">
            <div className="join-card-header">
              <div>
                <h2>{nombre}</h2>
                <p>{descripcion}</p>
              </div>
              <span className="join-badge">Grupo</span>
            </div>
            <div className="join-meta">
              <div className="join-metric">
                <p className="join-metric-label">Miembros</p>
                <p className="join-metric-value">{miembros}</p>
              </div>
            </div>
          </article>

          <article className="join-card join-card-actions">
            <h3>Acciones</h3>
            <p className="detail-text">Para sumarte necesitas estar logueado.</p>
            {mensajeError && <p className="auth-error">{mensajeError}</p>}
            {mensajeOk && <p className="auth-success">{mensajeOk}</p>}
            <div className="join-actions">
              <button className="primary-btn" type="button" onClick={unirse} disabled={uniendo}>
                {uniendo ? 'Uniendo...' : 'Unirme al grupo'}
              </button>
              {!haySesion() && (
                <Link className="ghost-btn" to="/login">
                  Ir a login
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default GroupJoin
