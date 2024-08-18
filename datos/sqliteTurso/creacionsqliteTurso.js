import { createClient } from '@libsql/client'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

const sqlitestmt = createClient({
  url: 'libsql://general-desarrolloinbox.turso.io',
  authToken: process.env.tokenSQLite
})

// -- Crear la tabla permisos
await sqlitestmt.execute('DROP TABLE IF EXISTS tblpermisos')
await sqlitestmt.execute(`
    CREATE TABLE IF NOT EXISTS tblpermisos (
        permiso TEXT NOT NULL UNIQUE,
        descripcion TEXT NOT NULL
    )`)
// -- Insertar permisos
await sqlitestmt.execute({
  sql: 'INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)',
  args: ['USR-LS', 'Usuarios - Solo ver lista de usuarios']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)',
  args: ['USR-RO', 'Usuarios - Ver el detalle de un usuario']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)',
  args: ['USR-WR', 'Usuarios - Ver/Modificar el detalle de un usuario']
})
// -- Consultar permisos
let result1 = await sqlitestmt.execute('SELECT *, rowid FROM tblpermisos LIMIT 2 OFFSET 0')
console.log(result1)
result1 = await sqlitestmt.execute('SELECT *, rowid FROM tblpermisos LIMIT 2 OFFSET 2')
console.log(result1)

// -- Crear la tabla usuarios
await sqlitestmt.execute('DROP TABLE IF EXISTS tblusuarios')
await sqlitestmt.execute(
      `CREATE TABLE IF NOT EXISTS tblusuarios
          (
          id TEXT NOT NULL,
          nombre TEXT NOT NULL,
          correo TEXT NOT NULL UNIQUE,
          contraseya TEXT NOT NULL,
          estado TEXT NOT NULL default 'Activo',
          PRIMARY KEY ('id'))
`)
//  -- Insertar valores en usuarios

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

const pw1 = await bcrypt.hash('Uno01qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg1}`, 'nombre uno', 'uno01@a.com', `${pw1}`]
})
const pw2 = await bcrypt.hash('Dos02qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg2}`, 'nombre dos', 'dos02@a.com', `${pw2}`]
})
const pw3 = await bcrypt.hash('Tres03qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg3}`, 'nombre tres', 'tres03@a.com', `${pw3}`]
})
const pw4 = await bcrypt.hash('Cuatro04qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg4}`, 'nombre cuatro', 'cuatro04@a.com', `${pw4}`]
})
const pw5 = await bcrypt.hash('Cinco05qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg5}`, 'nombre cinco', 'cinco05@a.com', `${pw5}`]
})
const pw6 = await bcrypt.hash('Seis06qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg6}`, 'nombre seis', 'seis06@a.com', `${pw6}`]
})
const pw7 = await bcrypt.hash('Siete07qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg7}`, 'nombre siete', 'siete07@a.com', `${pw7}`]
})
const pw8 = await bcrypt.hash('Ocho08qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg8}`, 'nombre ocho', 'ocho08@a.com', `${pw8}`]
})
const pw9 = await bcrypt.hash('Nueve09qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg9}`, 'nombre nueve', 'nueve09@a.com', `${pw9}`]
})
const pw10 = await bcrypt.hash('Diez10qwerty', 10)
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES (?, ?, ?, ?)',
  args: [`${reg10}`, 'nombre diez', 'diez10@a.com', `${pw10}`]
})
const result = await sqlitestmt.execute({
  sql: 'SELECT rowid, * FROM tblusuarios WHERE rowid=2',
  args: []
})
console.log(result)

// -- Crear la tabla Usuarios-Permisos
await sqlitestmt.execute('DROP TABLE IF EXISTS tblusuarios_tblpermisos')
await sqlitestmt.execute(`
    CREATE TABLE IF NOT EXISTS tblusuarios_tblpermisos
        (usuario_id char(36) NOT NULL,
        permiso_id char(6) NOT NULL,
        PRIMARY KEY (usuario_id,permiso_id)
      )`)
// -- Insertar Usuarios-permisos
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg1}`, 'USR-LS']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg1}`, 'USR-RO']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg1}`, 'USR-WR']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg2}`, 'USR-LS']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg2}`, 'USR-WR']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg3}`, 'USR-LS']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg4}`, 'USR-WR']
})
await sqlitestmt.execute({
  sql: 'INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES (?, ?)',
  args: [`${reg5}`, 'USR-RO']
})
// -- Consultar Usuarios-permisos
result1 = await sqlitestmt.execute('SELECT *, rowid FROM tblusuarios_tblpermisos')
console.log(result1)
