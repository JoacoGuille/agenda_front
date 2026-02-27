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

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    throw new Error(datos.message || 'Error')
  }

  return datos
}
