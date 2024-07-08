import conexion from '../../datos/mysql/conexion_mysql.js'
import generaLog from '../../utilerias/generaLog.js'
import bcrypt from 'bcrypt'

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
      console.log('A', paginaNumero)
      if (!Number.isInteger(paginaNumero)) {
        paginaNumero = 1
      }
      console.log('B', paginaNumero)
      if (paginaNumero < 1) {
        paginaNumero = 1
      }
      console.log('C', paginaNumero)
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
    console.log('pagina ', paginaNumero, ' registros ', registrosNumero, '   multipliac ', paginaNumero * registrosNumero)
    try {
      const [resUsr] = await conexion.query(
        `SELECT BIN_TO_UUID(ID) as id, nombre, correo, estado
          FROM tblusuarios 
          ${(lowerCaseOrderBy === 'correo' ? 'ORDER BY correo' : (lowerCaseOrderBy === 'id' ? 'ORDER BY id' : ''))} 
          LIMIT ${(paginaNumero - 1) * registrosNumero}, ${registrosNumero}`)
      return resUsr
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> getAll', e.message)
      return []
    }
  }

  static async getById ({ id }) {
    try {
      const [resUsr] = await conexion.query(
        `SELECT BIN_TO_UUID(ID) as id, nombre, correo, estado, contraseya
        FROM tblusuarios WHERE BIN_TO_UUID(id) = ?;`,
        [id])
      if (resUsr.length === 0) return {}
      return resUsr[0]
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> getById', e.message)
      return {}
    }
  }

  static async getByCorreo ({ correo }) {
    try {
      const [resUsr] = await conexion.query(
        `SELECT BIN_TO_UUID(ID), nombre, correo, estado, contraseya
        FROM tblusuarios WHERE correo = ?;`,
        [correo])
      if (resUsr.length === 0) return {}
      return resUsr[0]
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> getByCorreo', e.message)
      return {}
    }
  }

  static async create ({ input }) {
    const { nombre, correo, contraseya, estado } = input

    try {
      const contrasenaEncriptada = await bcrypt.hash(contraseya, 10)

      const [uuidResult] = await conexion.query('SELECT UUID() uuid')
      const [{ uuid }] = uuidResult

      await conexion.execute(
        `INSERT INTO tblusuarios (id, nombre, correo, contraseya, estado) 
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?);`,
        [nombre, correo, contrasenaEncriptada, estado]
      )

      const objeto = {
        id: uuid, nombre, correo, contrasenaEncriptada, estado
      }
      return objeto
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> create', e.message)
      return {}
    }
  }

  static async delete ({ id }) {
    try {
      const [resultado] = await conexion.execute(
        'DELETE FROM tblusuarios WHERE BIN_TO_UUID(id) = ?;',
        [id]
      )
      console.log(resultado)
      if (resultado.affectedRows > 0) return true
      return false
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> delete', e.message)
      return false
    }
  }

  static async update ({ id, input, agregarContrasena }) {
    const { nombre, correo, contraseya, estado } = input
    try {
      let resultado
      if (agregarContrasena === 'Si') {
        const contraseyaEncriptada = await bcrypt.hash(contraseya, 10)
        console.log(contraseyaEncriptada)
        resultado = await conexion.execute(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, contraseya = ?, estado = ? WHERE BIN_TO_UUID(id) = ?;',
          [nombre, correo, contraseyaEncriptada, estado, id]
        )
      } else {
        resultado = await conexion.execute(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ? WHERE BIN_TO_UUID(id) = ?;',
          [nombre, correo, estado, id]
        )
      }
      if (resultado[0].affectedRows > 0) return { id, nombre, correo, estado }
      return {}
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> update', e.message)
      return {}
    }
  }
}

(async () => {
  // console.log(await UsuarioModelo.getById({ id: 'edbd7eb6-38b6-11ef-82bf-ac1a3d752bd0' }))
  // console.log(await UsuarioModelo.getByCorreo({ correo: 'cuatro@a' }))
  // console.log(
  // await UsuarioModelo.create({ input: { nombre: 'b6', correo: 'b6@a', estado: 'b6', contraseya: 'b6' } }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', pagina: 1, registros: '3' }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', registros: '3' }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', pagina: 3 }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', pagina: 1 }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'idq', pagina: 1, registros: 5 }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'id', pagina: 1, registros: 5 }))
  // console.log(await UsuarioModelo.getAll({ pagina: 1, registros: 5 }))
  // console.log(await UsuarioModelo.delete({ id: '3891acaa-38ca-11ef-82bf-ac1a3d752bd0' }))
  // console.log(await UsuarioModelo.getById({ id: 'edbd7eb6-38b6-11ef-82bf-ac1a3d752bd0' }))
  // console.log(await UsuarioModelo.update({
  //   id: 'edbd7eb6-38b6-11ef-82bf-ac1a3d752bd0',
  //   input: {nombre: 'cuatromas4', correo: 'cuatro@amas4', estado:'cuatroa4', contraseya:'cin4'}, agregarContrasena: 'Si' }))
  //  console.log(await UsuarioModelo.getById({ id: 'edbd7eb6-38b6-11ef-82bf-ac1a3d752bd0' }))
  // console.log(await UsuarioModelo.getAll({}))
})()
