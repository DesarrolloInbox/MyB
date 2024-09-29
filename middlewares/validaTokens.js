import jwt from 'jsonwebtoken'

export const revisaToken = async (req, res, next) => {
  if (req.url === '/api/login') {
    next()
  } else {
    const token = req.headers.authorization
    if (!token) {
     return res.json({ estado: 0, payload: null, error: 'Falta información de autorización', msg: 'Falta el encabezado authorization' })
    }
    const soloToken = req.headers.authorization.split(' ')[1]
    if (!soloToken) {
     return res.json({ estado: 0, payload: null, error: 'Falta información de autorización', msg: 'Falta el dato Bearer Token' })
    }
    try {
     jwt.verify(soloToken, process.env.JWT_SECRETO)
      next()
    } catch (e) {
     return res.status(404).json({ estado: 0, payload: null, error: 'Token invalido', msg: e.message })
    }
  }
}
