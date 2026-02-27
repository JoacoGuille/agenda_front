const CLAVE_USUARIO = 'user'
const CLAVE_TOKEN = 'token'

export function guardarSesion({ user: usuario, token }) {
  if (usuario) {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
  }
  if (token) {
    localStorage.setItem(CLAVE_TOKEN, token)
  }
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_USUARIO)
  localStorage.removeItem(CLAVE_TOKEN)
}

export function traerUsuario() {
  const guardado = localStorage.getItem(CLAVE_USUARIO)
  if (!guardado) return null
  try {
    return JSON.parse(guardado)
  } catch {
    return null
  }
}

export function traerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function haySesion() {
  return Boolean(traerToken())
}