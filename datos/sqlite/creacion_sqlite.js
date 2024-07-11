import x from 'sqlite3'
import crypto from 'node:crypto'

const sqlite3 = x.verbose()

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
        console.log('Tabla tblpermisos creada')
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

    this.#db.exec(`
      INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES
        ('${reg1}', 'nombre uno', 'uno@a.com', 'Pwd01uno'),
        ('${reg2}', 'nombre dos', 'dos@a.com', 'Pwd01dos'),
        ('${reg3}', 'nombre tres', 'tres@a.com', 'Pwd01tres'),
        ('${reg4}', 'nombre cuatro', 'cuatro@a.com', 'Pwd01cuatro'),
        ('${reg5}', 'nombre cinco', 'cinco@a.com', 'Pwd01cinco')
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

DB.open()
DB.createTables()
DB.close()
