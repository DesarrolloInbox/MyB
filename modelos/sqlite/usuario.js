import bcrypt from 'bcrypt'
import { DB } from '../../datos/sqlite/conexion_sqlite.js'
import generaLog from '../../utilerias/generaLog.js'

export class UsuarioModelo {
  static async getAll ({ orderby, pagina, registros }) {
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
      await DB.close()
      return resUsr
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getAll', e.message)
      await DB.close()
      return []
    }
  }

  static async getById ({ id }) {
    try {
      let conexion = await DB.open()
      const resUsr = await conexion.all(
        `SELECT id, nombre, correo, estado, contraseya
        FROM tblusuarios WHERE id = ?;`,
        id)
      DB.close()
      if (resUsr.length === 0) return {}
      conexion = await DB.open()
      const resSeg = await conexion.all(
        'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?', id)
      DB.close()
      const seguridad = []
      resSeg.forEach(ele => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...resUsr[0],
        seguridad
      }
      return resUsr2
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getById', e.message)
      await DB.close()
      return {}
    }
  }

  static async getByCorreo ({ correo }) {
    try {
      let conexion = await DB.open()
      const resUsr = await conexion.all(
        `SELECT id, nombre, correo, estado, contraseya
        FROM tblusuarios WHERE correo = ?;`,
        correo)
      DB.close()
      if (resUsr.length === 0) return {}
      conexion = await DB.open()
      const resSeg = await conexion.all(
        'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?', resUsr[0].id)
      DB.close()
      const seguridad = []
      resSeg.forEach(ele => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...resUsr[0],
        seguridad
      }
      console.log(resUsr2)
      return resUsr2
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getByCorreo', e.message)
      await DB.close()
      return {}
    }
  }

  static async create ({ input }) {
    const { nombre, correo, contraseya, estado, seguridad } = input
    try {
      const contrasenaEncriptada = await bcrypt.hash(contraseya, 10)
      const uuid = crypto.randomUUID()
      const conexion = await DB.open()
      await conexion.run(
        `INSERT INTO tblusuarios (id, nombre, correo, contraseya, estado) 
        VALUES ("${uuid}", ?, ?, ?, ?);`,
        nombre, correo, contrasenaEncriptada, estado
      )

      const misValores = []
      if (seguridad.length > 0) {
        seguridad.forEach(async ele => {
          misValores.push([uuid, ele])
          await conexion.run(
            `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
            VALUES (?,?)`,
            uuid, ele
          )
        })
      }
      const objeto = {
        id: uuid, nombre, correo, contrasenaEncriptada, estado, seguridad: misValores
      }
      await DB.close()
      return objeto
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> create', e.message)
      await DB.close()
      return {}
    }
  }

  static async delete ({ id }) {
    try {
      const conexion = await DB.open()

      const { changes } = await conexion.run(
        'DELETE FROM tblusuarios WHERE id = ?',
        id
      )
      await DB.close()
      if (changes > 0) return true
      return false
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> delete', e.message)
      await DB.close()
      return false
    }
  }

  static async update ({ id, input, agregarContrasena, seguridad }) {
    const { nombre, correo, contraseya, estado } = input
    try {
      let resultado
      const conexion = await DB.open()
      if (agregarContrasena === 'Si') {
        const contraseyaEncriptada = await bcrypt.hash(contraseya, 10)
        resultado = await conexion.run(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, contraseya = ?, estado = ? WHERE id = ?;',
          nombre, correo, contraseyaEncriptada, estado, id
        )
        console.log('Cambiar contraseña ', resultado)
      } else {
        resultado = await conexion.run(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ? WHERE id = ?;',
          nombre, correo, estado, id
        )
        console.log('NO Cambiar contraseña ', resultado)
      }
      await conexion.run(
        `DELETE FROM tblusuarios_tblpermisos 
        WHERE usuario_id = ?`,
        id
      )
      if (seguridad) {
        if (seguridad.length > 0) {
          const misValores = []
          seguridad.forEach(async ele => {
            misValores.push([id, ele])
            await conexion.run(
              `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
              VALUES (?,?)`,
              id, ele
            )
          })
        }
      }
      await DB.close()
      if (resultado.changes > 0) return { id, nombre, correo, estado }
      return {}
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> update', e.message)
      await DB.close()
      return {}
    }
  }
}
