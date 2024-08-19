import { validatePartialUsuario } from '../esquemas/usuario.js'
import { esObjetoVacio } from '../utilerias/esObjetoVacio.js'
import generaLog from '../utilerias/generaLog.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export class LoginController {
  constructor ({ usuarioModelo }) {
    this.usuarioModelo = usuarioModelo
  }

  login = async (req, res) => {
    try {
      const result = validatePartialUsuario(req.body)
      if (!result.success) {
        // const tmp = JSON.parse(result.error.message)
        console.log(JSON.parse(result.error.message))
        return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida 1' })
      }
      const { correo, contraseya } = req.body
      if (correo === undefined || contraseya === undefined) return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida 2' })
      const objeto = await this.usuarioModelo.getByCorreo({ correo })
      if (esObjetoVacio(objeto)) return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida 3' })
      if (objeto.estado === 'Inactivo') return res.status(200).json({ estado: 0, error: 'Usuario Inactivo' })
      const matchPassword = await bcrypt.compare(contraseya, objeto.contraseya)
      if (!matchPassword) {
        return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida 4' })
      } else {
        const token = jwt.sign({
          nombre: objeto.nombre,
          correo: objeto.correo
        }, process.env.JWT_SECRETO, { expiresIn: 6000 }
        )
        res.status(200).json({
          estado: 1,
          payload: {
            token,
            id: objeto.id,
            nombre: objeto.nombre,
            correo: objeto.correo,
            seguridad: objeto.seguridad
          }
        })
      }
    } catch (e) {
      generaLog(new Date().toString(), e, 'controladores/login -> update', e.message)
      res.status(500).json({ error: e.message })
    }
  }

  validaToken = async (req, res) => {
    const { token } = req.body
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRETO)
      res.json({ estado: 1, payload: decoded, error: null, msg: null })
    } catch (e) {
      res.status(200).json({ estado: 0, error: 'Token invalido' })
    }
  }
}
