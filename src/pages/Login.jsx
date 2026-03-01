import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import { apiFetch } from '../services/api.js'
import { obtenerMensajeError } from '../utils/apiError.js'

function Login() {
  const irA = useNavigate()
  const [mensajeError, setMensajeError] = useState('')
  const [cargando, setCargando] = useState(false)

  const mandarForm = async (evento) => {
    evento.preventDefault()
    setMensajeError('')
    setCargando(true)
    const infoForm = new FormData(evento.currentTarget)
    const correo = infoForm.get('email')
    const clave = infoForm.get('password')

    try {
      const respuesta = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: correo, password: clave }),
      })
      localStorage.setItem('token', respuesta.token)
      localStorage.setItem('user', JSON.stringify(respuesta.user))
      irA('/dashboard')
    } catch (err) {
      setMensajeError(obtenerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Entra a tu cuenta"
      bajada="Volve a tu agenda en segundos."
      pie={
        <p>
          No tenes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={mandarForm}>
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
            placeholder="Tu contrasena"
            autoComplete="current-password"
            required
          />
        </label>
        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" name="remember" />
            Recordarme
          </label>
          <Link className="auth-link" to="/recuperar">
            Olvidaste tu contrasena?
          </Link>
        </div>
        {mensajeError && <p className="auth-error">{mensajeError}</p>}
        <button className="primary-btn auth-submit" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
