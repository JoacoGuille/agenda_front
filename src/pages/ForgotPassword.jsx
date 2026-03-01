import { Link } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import { apiFetch } from '../services/api.js'

function ForgotPassword() {
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')
  const [cargando, setCargando] = useState(false)

  const mandarForm = async (evento) => {
    evento.preventDefault()
    const form = evento.currentTarget
    setMensajeError('')
    setMensajeOk('')
    setCargando(true)
    const infoForm = new FormData(form)
    const correo = infoForm.get('email')

    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: correo }),
      })
      setMensajeOk('Si el mail existe, te llega el enlace para resetear.')
      form.reset()
    } catch (err) {
      setMensajeError(err.message || 'No se pudo enviar el link.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Recuperar contrasena"
      bajada="Te mandamos un link para crear una nueva contrasena."
      pie={
        <p>
          Te acordaste? <Link to="/login">Volver a login</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={mandarForm}>
        <label className="auth-field">
          Email
          <input
            type="email"
            name="email"
            placeholder="tuemail@ejemplo.com"
            autoComplete="email"
            required
          />
        </label>
        {mensajeError && <p className="auth-error">{mensajeError}</p>}
        {mensajeOk && <p className="auth-success">{mensajeOk}</p>}
        <button className="primary-btn auth-submit" type="submit" disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
