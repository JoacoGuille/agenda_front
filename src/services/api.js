const URL_API = import.meta.env.VITE_API_URL

export const apiFetch = async (ruta, opciones = {}) => {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${URL_API}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opciones.headers,
    },
  })

  let datos = null
  try {
    datos = await respuesta.json()
  } catch {
    datos = null
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const error = new Error(datos?.message || 'Error')
    error.status = respuesta.status
    error.errors = Array.isArray(datos?.errors) ? datos.errors : null
    error.data = datos
    throw error
  }

  return datos
}
