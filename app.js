import express, { json } from 'express'
import cors from 'cors'
import { revisaToken } from './middlewares/validaTokens.js'

import { usuarioRutas } from './rutas/usuario.js'
import { loginRutas } from './rutas/login.js'

export const createApp = ({ usuarioModelo }) => {
  const app = express()
  app.use(json())
  app.use(cors())
  app.disable('x-powered-by')

  app.use(revisaToken)
  app.use('/api/usuarios', usuarioRutas({ usuarioModelo }))
  app.use('/api/login', loginRutas({ usuarioModelo }))

  app.listen(process.env.HTTP_PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${process.env.HTTP_PORT}`)
  })
}
