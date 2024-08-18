import x from 'sqlite3'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
// import { log } from 'node:console'

const sqlite3 = x.verbose()

let pw1 = ''
let pw2 = ''
let pw3 = ''
let pw4 = ''
let pw5 = ''
let pw6 = ''
let pw7 = ''
let pw8 = ''
let pw9 = ''
let pw10 = ''

export class DB {
  static #db

  static open () {
    if (this.#db === undefined) {
      this.#db = new sqlite3.Database(process.env.SQLITEPATHDB, (error) => {
        if (error) {
          console.log(error.message)
        } else {
          console.log('La Conexión esta lista')
        }
      })
    }
    return this.#db
  }

  static close () {
    if (this.#db !== undefined) {
      this.#db.close()
      this.#db = undefined
    }
  }

  static createTables () {
    this.#db.exec(`
      DROP TABLE IF EXISTS tblpermisos
      `, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblpermisos borrada')
      }
    }
    )
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS tblpermisos
        (permiso char(6) NOT NULL UNIQUE,
        descripcion varchar(255) NOT NULL)
      `, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblpermisos creada')
      }
    }
    )
    this.#db.exec(`
      INSERT INTO tblpermisos (permiso, descripcion) VALUES
        ('USR-LS', 'Usuarios - Solo ver lista de usuarios'),
        ('USR-RO', 'Usuarios - Ver el detalle de un usuario'),
        ('USR-WR', 'Usuarios - Ver/Modificar el detalle de un usuario')
      `, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblpermisos llenada con datos iniciales')
      }
    }
    )

    this.#db.exec(`
      DROP TABLE IF EXISTS tblusuarios
      `, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblusuarios borrada')
      }
    }
    )
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS tblusuarios
        (id char(36) NOT NULL,
        nombre varchar(255) NOT NULL,
        correo varchar(255) NOT NULL UNIQUE,
        contraseya TEXT NOT NULL,
        estado varchar(10) NOT NULL default 'Activo',
        PRIMARY KEY ('id')
      )`, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblusuarios creada')
      }
    }
    )
    const reg1 = crypto.randomUUID()
    const reg2 = crypto.randomUUID()
    const reg3 = crypto.randomUUID()
    const reg4 = crypto.randomUUID()
    const reg5 = crypto.randomUUID()
    const reg6 = crypto.randomUUID()
    const reg7 = crypto.randomUUID()
    const reg8 = crypto.randomUUID()
    const reg9 = crypto.randomUUID()
    const reg10 = crypto.randomUUID()

    this.#db.exec(`
      INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES
      ('${reg1}', 'nombre uno', 'uno01@a.com', '${pw1}'),
        ('${reg2}', 'nombre dos', 'dos02@a.com', '${pw2}'),
        ('${reg3}', 'nombre tres', 'tres03@a.com', '${pw3}'),
        ('${reg4}', 'nombre cuatro', 'cuatro04@a.com', '${pw4}'),
        ('${reg5}', 'nombre cinco', 'cinco05@a.com', '${pw5}'),
        ('${reg6}', 'nombre seis', 'seis06@a.com', '${pw6}'),
        ('${reg7}', 'nombre siete', 'siete07@a.com', '${pw7}'),
        ('${reg8}', 'nombre ocho', 'ocho08@a.com', '${pw8}'),
        ('${reg9}', 'nombre nueve', 'nueve09@a.com', '${pw9}'),
        ('${reg10}', 'nombre diez', 'diez10@a.com', '${pw10}')
      `, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblusuarios llenada con datos')
      }
    }
    )

    this.#db.exec(`
      DROP TABLE IF EXISTS tblusuarios_tblpermisos
      `, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblusuarios_tblpermisos borrada')
      }
    }
    )
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS tblusuarios_tblpermisos
        (usuario_id char(36) NOT NULL,
        permiso_id char(6) NOT NULL,
        PRIMARY KEY (usuario_id,permiso_id)
      )`, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblusuarios_tblpermisos creada')
      }
    }
    )
    this.#db.exec(`
      INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES
        ('${reg1}', 'USR-LS'),
        ('${reg1}', 'USR-RO'),
        ('${reg1}', 'USR-WR'),
        ('${reg2}', 'USR-LS'),
        ('${reg2}', 'USR-WR'),
        ('${reg3}', 'USR-LS'),
        ('${reg4}', 'USR-WR'),
        ('${reg5}', 'USR-RO')`, (error) => {
      if (error) {
        console.log(error.message)
      } else {
        console.log('Tabla tblusuarios_tblpermisos llenada con datos')
      }
    }
    )
  }
}

(async () => {
  pw1 = await bcrypt.hash('Uno01qwerty', 10)
  pw2 = await bcrypt.hash('Dos02qwerty', 10)
  pw3 = await bcrypt.hash('Tres03qwerty', 10)
  pw4 = await bcrypt.hash('Cuatro04qwerty', 10)
  pw5 = await bcrypt.hash('Cinco05qwerty', 10)
  pw6 = await bcrypt.hash('Seis06qwerty', 10)
  pw7 = await bcrypt.hash('Siete07qwerty', 10)
  pw8 = await bcrypt.hash('Ocho08qwerty', 10)
  pw9 = await bcrypt.hash('Nueve09qwerty', 10)
  pw10 = await bcrypt.hash('Diez10qwerty', 10)
  console.log('Terminado')
  DB.open()
  DB.createTables()
  DB.close()
})()
