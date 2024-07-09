import conexion from '../../datos/mysql/conexion_mysql.js'
import generaLog from '../../utilerias/generaLog.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

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
      const [resUsr] = await conexion.query(
        `SELECT id, nombre, correo, estado
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
        `SELECT id, nombre, correo, estado
        FROM tblusuarios WHERE id = ?;`,
        [id])
      if (resUsr.length === 0) return {}
      const [resSeg] = await conexion.query(
        'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?',
        [id])
      const seguridad = []
      resSeg.forEach(ele => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...resUsr[0],
        seguridad
      }
      return resUsr2
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> getById', e.message)
      return {}
    }
  }

  static async getByCorreo ({ correo }) {
    try {
      const [resUsr] = await conexion.query(
        `SELECT id, nombre, correo, estado, contraseya
        FROM tblusuarios WHERE correo = ?;`,
        [correo])
      if (resUsr.length === 0) return {}
      const [resSeg] = await conexion.query(
        'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?',
        [resUsr[0].id])
      const seguridad = []
      resSeg.forEach(ele => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...resUsr[0],
        seguridad
      }
      return resUsr2
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> getByCorreo', e.message)
      return {}
    }
  }

  static async create ({ input }) {
    const { nombre, correo, contraseya, estado, seguridad } = input
    try {
      const contrasenaEncriptada = await bcrypt.hash(contraseya, 10)
      const uuid = crypto.randomUUID()
      await conexion.execute(
        `INSERT INTO tblusuarios (id, nombre, correo, contraseya, estado) 
        VALUES ("${uuid}", ?, ?, ?, ?);`,
        [nombre, correo, contrasenaEncriptada, estado]
      )
      const misValores = []
      if (seguridad.length > 0) {
        seguridad.forEach(ele => misValores.push([uuid, ele]))
        await conexion.query(
          `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
          VALUES ?`,
          [misValores]
        )
      }
      const objeto = {
        id: uuid, nombre, correo, contrasenaEncriptada, estado, seguridad: misValores
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
        'DELETE FROM tblusuarios WHERE id = ?;',
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

  static async update ({ id, input, agregarContrasena, seguridad }) {
    const { nombre, correo, contraseya, estado } = input
    try {
      let resultado
      if (agregarContrasena === 'Si') {
        const contraseyaEncriptada = await bcrypt.hash(contraseya, 10)
        resultado = await conexion.execute(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, contraseya = ?, estado = ? WHERE id = ?;',
          [nombre, correo, contraseyaEncriptada, estado, id]
        )
      } else {
        resultado = await conexion.execute(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ? WHERE id = ?;',
          [nombre, correo, estado, id]
        )
      }
      await conexion.execute(
        `DELETE FROM tblusuarios_tblpermisos 
        WHERE usuario_id = ?`,
        [id]
      )
      if (seguridad) {
        if (seguridad.length > 0) {
          const misValores = []
          seguridad.forEach(ele => misValores.push([id, ele]))
          await conexion.query(
            `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
            VALUES ?`,
            [misValores]
          )
        }
      }
      if (resultado[0].affectedRows > 0) return { id, nombre, correo, estado }
      return {}
    } catch (e) {
      generaLog(new Date().toString(), e, 'modelos/mysql/usuario -> update', e.message)
      return {}
    }
  }
}

// const unDato = 'treinta'
// const unSeguridad = ['vuno', 'vdos']
// console.log();

// (async () => {
  // console.log(await UsuarioModelo.getByCorreo({ correo: 'uno@a' }))
  // console.log(
  //  await UsuarioModelo.create({ 
  //    input: { nombre: unDato, correo: `${unDato}@a`, estado: unDato, 
  //      contraseya: unDato, seguridad: unSeguridad } }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', pagina: 1, registros: '50' }))
  // console.log(await UsuarioModelo.getById({ id: '18ea82d8-f62a-424c-998c-8e51b9031e20' }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', registros: '3' }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', pagina: 3 }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'correo', pagina: 1 }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'idq', pagina: 1, registros: 5 }))
  // console.log(await UsuarioModelo.getAll({ orderby: 'id', pagina: 1, registros: 5 }))
  // console.log(await UsuarioModelo.getAll({ pagina: 1, registros: 5 }))
  // console.log(await UsuarioModelo.delete({ id: '3891acaa-38ca-11ef-82bf-ac1a3d752bd0' }))
  // console.log(await UsuarioModelo.getById({ id: 'c412affc-3d7c-11ef-82bf-ac1a3d752bd0' }))
  // console.log(await UsuarioModelo.update({
  //   id: '18ea82d8-f62a-424c-998c-8e51b9031e20',
  //   input: { nombre: unDato, correo: `${unDato}@a`, estado: unDato, contraseya: unDato },
  //    agregarContrasena: 'Si'}))
  //   console.log(await UsuarioModelo.getById({ id: '18ea82d8-f62a-424c-998c-8e51b9031e20' }))
  // console.log(await UsuarioModelo.getAll({}))
// })()
