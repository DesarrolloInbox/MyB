import bcrypt from 'bcrypt'
import { DB } from '../../datos/sqlite/conexion_sqlite.js'
import generaLog from '../../utilerias/generaLog.js'

export class UsuarioModelo {
  static async getAll({ orderby, pagina, registros }) {
    let lowerCaseOrderBy
    let paginaNumero = 1
    let registrosNumero = process.env.REGISTROS_MOSTRAR_MAX
    if (orderby) {
      lowerCaseOrderBy = orderby.toLowerCase()
    }
    if (pagina) {
      paginaNumero = parseInt(pagina)
      if (!Number.isInteger(paginaNumero)) {
        paginaNumero = 1
      }
      if (paginaNumero < 1) {
        paginaNumero = 1
      }
    }
    if (registros) {
      registrosNumero = parseInt(registros)
      if (!Number.isInteger(registrosNumero)) {
        registrosNumero = process.env.REGISTROS_MOSTRAR_MAX
      }
      if ((registrosNumero < 0) || (registrosNumero > process.env.REGISTROS_MOSTRAR_MAX)) {
        registrosNumero = process.env.REGISTROS_MOSTRAR_MAX
      }
    }

    try {
      const conexion = await DB.open()
      const resUsr = await conexion.all(
        `SELECT id, nombre, correo, estado
      FROM tblusuarios 
      ${(lowerCaseOrderBy === 'correo' ? 'ORDER BY correo' : (lowerCaseOrderBy === 'id' ? 'ORDER BY id' : ''))} 
      LIMIT ${(paginaNumero - 1) * registrosNumero}, ${registrosNumero}`)
      await DB.open()
      return resUsr
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getAll', e.message)
      await DB.close()
      return []
    }
  }
}

// UsuarioModelo.getAll({ orderby: 'correo', pagina: 2, registros: 2 })
