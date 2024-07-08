import { Router } from 'express'
import { LoginController } from '../controladores/login.js'

export const loginRutas = ({ usuarioModelo }) => {
  const loginRouter = Router()

  const loginController = new LoginController({ usuarioModelo })

  loginRouter.post('/', loginController.login)
  loginRouter.post('/validaToken', loginController.validaToken)

  return loginRouter
}
