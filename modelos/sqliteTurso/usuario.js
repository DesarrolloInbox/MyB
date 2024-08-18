import bcrypt from 'bcrypt'
import conexion from '../../datos/sqliteTurso/conexion_sqliteTurso.js'
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

    const stmt = `SELECT id, nombre, correo, estado FROM tblusuarios ${(lowerCaseOrderBy === 'correo' ? 'ORDER BY correo' : (lowerCaseOrderBy === 'id' ? 'ORDER BY id' : ''))} LIMIT ${registrosNumero}, ${(paginaNumero - 1) * registrosNumero};`
    console.log('La consulta es ', stmt)
    try {
      const { rows } = await conexion.execute({
        sql: `${stmt}`,
        args: []
      })
      return rows
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getAll', e.message)
      return []
    }
  }

  static async getById ({ id }) {
    try {
      const { rows } = await conexion.execute({
        sql: `SELECT id, nombre, correo, estado, contraseya
        FROM tblusuarios WHERE id = ?;`,
        args: [id]
      })
      if (rows.length === 0) return {}
      const resSeg = await conexion.execute({
        sql: 'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?',
        args: [rows[0].id]
      })
      const seguridad = []
      resSeg.rows.forEach(ele => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...rows[0],
        seguridad
      }
      return resUsr2
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getById', e.message)
      return {}
    }
  }

  static async getByCorreo ({ correo }) {
    try {
      const { rows } = await conexion.execute({
        sql: `SELECT id, nombre, correo, estado, contraseya
        FROM tblusuarios WHERE correo = ?;`,
        args: [correo]
      })
      if (rows.length === 0) return {}
      const resSeg = await conexion.execute({
        sql: 'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?',
        args: [rows[0].id]
      })
      const seguridad = []
      resSeg.rows.forEach(ele => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...rows[0],
        seguridad
      }
      return resUsr2
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> getByCorreo', e.message)
      return {}
    }
  }

  static async create ({ input }) {
    const { nombre, correo, contraseya, estado, seguridad } = input
    try {
      const contrasenaEncriptada = await bcrypt.hash(contraseya, 10)
      const uuid = crypto.randomUUID()
      await conexion.execute({
        sql: `INSERT INTO tblusuarios (id, nombre, correo, contraseya, estado) 
        VALUES ("${uuid}", ?, ?, ?, ?);`,
        args: [nombre, correo, contrasenaEncriptada, estado]
      })

      const misValores = []
      if (seguridad.length > 0) {
        seguridad.forEach(async ele => {
          misValores.push([uuid, ele])
          await conexion.execute({
            sql: `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
            VALUES (?,?)`,
            args: [uuid, ele]
          })
        })
      }
      const objeto = {
        id: uuid, nombre, correo, contrasenaEncriptada, estado, seguridad: misValores
      }
      return objeto
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> create', e.message)
      return {}
    }
  }

  static async delete ({ id }) {
    try {
      const { rowsAffected } = await conexion.execute({
        sql: 'DELETE FROM tblusuarios WHERE id = ?',
        args: [id]
      })
      if (rowsAffected > 0) return true
      return false
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> delete', e.message)
      return false
    }
  }

  static async update ({ id, input, agregarContrasena, seguridad }) {
    const { nombre, correo, contraseya, estado } = input
    try {
      let resultado
      if (agregarContrasena === 'Si') {
        const contraseyaEncriptada = await bcrypt.hash(contraseya, 10)
        const { rowsAffected } = await conexion.execute({
          sql: 'UPDATE tblusuarios SET nombre = ?, correo = ?, contraseya = ?, estado = ? WHERE id = ?;',
          args: [nombre, correo, contraseyaEncriptada, estado, id]
        })
        resultado = rowsAffected
        console.log('Cambiar contraseña ', resultado)
      } else {
        const { rowsAffected } = await conexion.execute({
          sql: 'UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ? WHERE id = ?;',
          args: [nombre, correo, estado, id]
        })
        resultado = rowsAffected
        console.log('NO Cambiar contraseña ', resultado)
      }
      await conexion.execute({
        sql: `DELETE FROM tblusuarios_tblpermisos 
        WHERE usuario_id = ?`,
        args: [id]
      })
      if (seguridad) {
        if (seguridad.length > 0) {
          const misValores = []
          seguridad.forEach(async ele => {
            misValores.push([id, ele])
            await conexion.execute({
              sql: `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
              VALUES (?,?)`,
              args: [id, ele]
            })
          })
        }
      }
      if (resultado > 0) return { id, nombre, correo, estado }
      return {}
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/sqlite/usuario -> update', e.message)
      return {}
    }
  }
}
