import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { apiFetch } from '../services/api.js'
import { obtenerMensajeError } from '../utils/apiError.js'

function VerifyEmail() {
  const ubicacion = useLocation()
  const [estadoVerif, setEstadoVerif] = useState('cargando')
  const [texto, setTexto] = useState('Verificando tu cuenta...')

    useEffect(() => {
      const tokenLink = new URLSearchParams(ubicacion.search).get('token')

      if (!tokenLink) {
        setEstadoVerif('error')
        setTexto('El link de verificacion es invalido.')
        return
      }

      // IMPORTANTE: NO poner /api/auth
      apiFetch(`/auth/verify-email?token=${encodeURIComponent(tokenLink)}`)
        .then(() => {
          setEstadoVerif('ok')
          setTexto('Cuenta verificada. Ya podes iniciar sesion.')
        })
        .catch((err) => {
          setEstadoVerif('error')
          setTexto(obtenerMensajeError(err))
        })

    }, [ubicacion.search])

  return (
    <AuthLayout
      titulo="Verificacion de correo"
      bajada="Confirmamos tu cuenta para que puedas entrar."
      pie={
        <p>
          Listo? <Link to="/login">Ir a login</Link>
        </p>
      }
    >
      {estadoVerif === 'cargando' && <p className="auth-note">{texto}</p>}
      {estadoVerif === 'ok' && <p className="auth-success">{texto}</p>}
      {estadoVerif === 'error' && <p className="auth-error">{texto}</p>}
    </AuthLayout>
  )
}

export default VerifyEmail
