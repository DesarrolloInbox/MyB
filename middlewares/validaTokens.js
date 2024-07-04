import jwt from 'jsonwebtoken'

export const revisaToken = async (req, res, next) => {
  console.log('Estoy en el middleware de Revisa Token')
  console.log('Req.Body ', req.body)
  if (req.url === '/api/login') {
    next()
  } else {
    next()
  }
}
