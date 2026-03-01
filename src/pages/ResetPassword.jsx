import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import { apiFetch } from '../services/api.js'
import { validarContrasena } from '../utils/passwordRules.js'

function ResetPassword() {
  const irA = useNavigate()
  const ubicacion = useLocation()
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')
  const [cargando, setCargando] = useState(false)

  const tokenLink = new URLSearchParams(ubicacion.search).get('token')

  const mandarForm = async (evento) => {
    evento.preventDefault()
    setMensajeError('')
    setMensajeOk('')

    if (!tokenLink) {
      setMensajeError('El link es invalido o esta vencido.')
      return
    }

    const infoForm = new FormData(evento.currentTarget)
    const clave = infoForm.get('password')
    const repetir = infoForm.get('confirmPassword')

    const errorClave = validarContrasena(clave)
    if (errorClave) {
      setMensajeError(errorClave)
      return
    }

    if (clave !== repetir) {
      setMensajeError('Las contrasenas no coinciden.')
      return
    }

    setCargando(true)
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: tokenLink, newPassword: clave }),
      })
      setMensajeOk('Contrasena actualizada. Ya podes ingresar.')
      setTimeout(() => irA('/login'), 1200)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo actualizar la contrasena.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Nueva contrasena"
      bajada="Elegi una contrasena segura para seguir con tu agenda."
      pie={
        <p>
          Ya la cambiaste? <Link to="/login">Ir a login</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={mandarForm}>
        <label className="auth-field">
          Nueva contrasena
          <input
            type="password"
            name="password"
            placeholder="Minimo 8, 1 mayuscula, 1 numero y 1 simbolo"
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
        {mensajeError && <p className="auth-error">{mensajeError}</p>}
        {mensajeOk && <p className="auth-success">{mensajeOk}</p>}
        <button className="primary-btn auth-submit" type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar y entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
