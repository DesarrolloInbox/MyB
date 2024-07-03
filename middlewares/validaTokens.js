import jwt from 'jsonwebtoken'

export const revisaToken = async (req, res, next) => {
  console.log('Estoy en el middleware de Revisa Token')
  if (req.url === '/api/login') {
    next()
  } else {
    next()
  }
}
