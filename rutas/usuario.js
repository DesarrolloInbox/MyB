import { Router } from 'express'
import { UsuarioController } from '../controladores/usuario.js'

export const usuarioRutas = ({ usuarioModelo }) => {
  const usuarioRouter = Router()

  const usuarioController = new UsuarioController({ usuarioModelo })

  usuarioRouter.get('/', usuarioController.getAll)
  usuarioRouter.get('/:id', usuarioController.getById)
  usuarioRouter.post('/', usuarioController.create)
  usuarioRouter.delete('/:id', usuarioController.delete)
  usuarioRouter.delete('/', usuarioController.delete)
  usuarioRouter.patch('/:id', usuarioController.update)

  return usuarioRouter
}
