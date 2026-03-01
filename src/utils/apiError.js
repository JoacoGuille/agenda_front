export const obtenerMensajeError = (error) => {
  if (!error) return 'Ocurrio un error.'

  let mensaje = error.message || 'Ocurrio un error.'
  const errores = Array.isArray(error.errors) ? error.errors : []

  if (error.status === 400 && errores.length > 0) {
    const detalle = errores
      .map((item) => {
        if (!item) return ''
        const campo = item.field ? String(item.field) : ''
        const texto = item.message ? String(item.message) : ''
        if (campo && texto) return `${campo}: ${texto}`
        return texto || campo
      })
      .filter(Boolean)
      .join(' | ')

    if (detalle) {
      mensaje = `${mensaje}. ${detalle}`
    }
  }

  return mensaje
}
