import { validateUsuario, validatePartialUsuario } from '../esquemas/usuario.js'
import { esObjetoVacio } from '../utilerias/esObjetoVacio.js'
import generaLog from '../utilerias/generaLog.js'

export class UsuarioController {
  constructor ({ usuarioModelo }) {
    this.usuarioModelo = usuarioModelo
  }

  getAll = async (req, res) => {
    const payload = await this.usuarioModelo.getAll({})
    res.json({ estado: 1, payload, error: null, msg: null })
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const payload = await this.usuarioModelo.getById({ id })
      if (esObjetoVacio(payload)) return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: null })
      res.json({ estado: 1, payload, error: null, msg: null })
    } catch (e) {
      generaLog(new Date().toString(), e, 'controladores/usuario -> getById', e.message)
      return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: e.message })
    }
  }

  create = async (req, res) => {
    const result = validateUsuario(req.body)
    if (!result.success) {
      return res.status(400).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: JSON.parse(result.error.message) })
    }
    try {
      const objeto = await this.usuarioModelo.create({ input: result.data })
      if (esObjetoVacio(objeto)) return res.status(201).json({ estado: 0, payload: null, error: 'Correo duplicado', msg: null })
      res.status(201).json({ estado: 1, payload: objeto, error: null, msg: null })
    } catch (e) {
      generaLog(new Date().toString(), e, 'controladores/usuario -> create', e.message)
      res.status(400).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: e })
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      if (id === undefined) return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: 'Falta indicar el id' })
      const result = validatePartialUsuario(req.body)
      if (!result.success) {
        return res.status(400).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: JSON.parse(result.error.message) })
      }
      const objeto = await this.usuarioModelo.getById({ id })
      if (esObjetoVacio(objeto)) return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: null })
      let agregarContrasena = 'No'
      if (req.body.contraseya) agregarContrasena = 'Si'
      const input = {
        ...objeto,
        ...req.body
      }
      const resultado = await this.usuarioModelo.update({ id, input, agregarContrasena })
      if (!(Object.keys(resultado).length === 0)) return res.status(200).json({ estado: 1, payload: resultado, error: null, msg: null });
      res.status(200).json({ estado: 0, payload: null, error: 'El Usuario no existe', msg: null })
    } catch (e) {
      generaLog(new Date().toString(), e, 'controladores/usuario -> update', e.message)
      return res.status(500).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: e.message })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.usuarioModelo.delete({ id })
      if (resultado === true) return res.status(200).json({ estado: 1, payload: resultado, error: null, msg: null })
      res.status(200).json({ estado: 0, payload: null, error: 'El usuario no se pudo eliminar', msg: null })
    } catch (e) {
      generaLog(new Date().toString(), e, 'controladores/usuario -> delete', e.message)
      return res.status(500).json({
        estado: 0, payload: null, error: 'El usuario no se pudo eliminar', msg: e
      })
    }
  }
}
