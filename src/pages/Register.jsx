import { Link } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import { apiFetch } from '../services/api.js'

function Register() {
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')
  const [cargando, setCargando] = useState(false)

  const mandarForm = async (evento) => {
    evento.preventDefault()
    setMensajeError('')
    setMensajeOk('')
    setCargando(true)
    const infoForm = new FormData(evento.currentTarget)
    const nombre = infoForm.get('name')
    const correo = infoForm.get('email')
    const clave = infoForm.get('password')
    const repetir = infoForm.get('confirmPassword')

    if (clave !== repetir) {
      setMensajeError('Las contrasenas no coinciden.')
      setCargando(false)
      return
    }

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: nombre, email: correo, password: clave }),
      })
      setMensajeOk('Listo. Revisa tu mail para verificar la cuenta.')
      evento.currentTarget.reset()
    } catch (err) {
      setMensajeError(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Crea tu cuenta"
      bajada="Valida tu mail y empeza a organizarte."
      variante="auth-compact"
      pie={
        <p>
          Ya tenes cuenta? <Link to="/login">Iniciar sesion</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={mandarForm}>
        <label className="auth-field">
          Nombre completo
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            autoComplete="name"
            required
          />
        </label>
        <label className="auth-field">
          Correo electronico
          <input
            type="email"
            name="email"
            placeholder="tuemail@ejemplo.com"
            autoComplete="email"
            required
          />
        </label>
        <label className="auth-field">
          Contrasena
          <input
            type="password"
            name="password"
            placeholder="Minimo 8 caracteres"
            autoComplete="new-password"
            required
          />
        </label>
        <label className="auth-field">
          Confirmar contrasena
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeti tu contrasena"
            autoComplete="new-password"
            required
          />
        </label>
        <label className="auth-check">
          <input type="checkbox" name="terms" required />
          Acepto terminos y condiciones
        </label>
        <p className="auth-note">Te llega un mail para activar la cuenta.</p>
        {mensajeError && <p className="auth-error">{mensajeError}</p>}
        {mensajeOk && <p className="auth-success">{mensajeOk}</p>}
        <button className="primary-btn auth-submit" type="submit" disabled={cargando}>
          {cargando ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register