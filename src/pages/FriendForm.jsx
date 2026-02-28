import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'

function FriendForm() {
  const irA = useNavigate()
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')
  const [cargando, setCargando] = useState(false)

  const mandarForm = async (evento) => {
    evento.preventDefault()
    setMensajeError('')
    setMensajeOk('')
    setCargando(true)
    const infoForm = new FormData(evento.currentTarget)
    const correo = infoForm.get('email')

    if (esDemo()) {
      setMensajeOk('Invitacion enviada.')
      evento.currentTarget.reset()
      setTimeout(() => irA('/amigos'), 800)
      setCargando(false)
      return
    }

    try {
      await apiFetch('/friends/invite', {
        method: 'POST',
        body: JSON.stringify({ email: correo }),
      })
      setMensajeOk('Invitacion enviada.')
      evento.currentTarget.reset()
      setTimeout(() => irA('/amigos'), 800)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo enviar la invitacion.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Amigos</p>
          <h1>Agregar amigo</h1>
          <p className="page-subtitle">Suma personas para compartir la agenda.</p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/amigos">
            Volver
          </Link>
        </div>
      </div>

      <div className="form-card">
        <form className="form-grid" onSubmit={mandarForm}>
          <label className="form-field form-field-full">
            Email
            <input
              type="email"
              name="email"
              placeholder="amigo@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>
          {mensajeError && <p className="auth-error form-field-full">{mensajeError}</p>}
          {mensajeOk && <p className="auth-success form-field-full">{mensajeOk}</p>}
          <div className="form-actions">
            <Link className="ghost-btn" to="/amigos">
              Cancelar
            </Link>
            <button className="primary-btn" type="submit" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar invitacion'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default FriendForm