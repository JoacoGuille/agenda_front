const PATRON_CONTRASENA = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const validarContrasena = (clave) => {
  if (PATRON_CONTRASENA.test(clave)) {
    return ''
  }

  return 'La contrasena debe tener minimo 8 caracteres, 1 mayuscula, 1 numero y 1 simbolo.'
}
