const OBJETOID_REGEX = /^[a-fA-F0-9]{24}$/

export const esObjectId = (valor) => typeof valor === 'string' && OBJETOID_REGEX.test(valor)
