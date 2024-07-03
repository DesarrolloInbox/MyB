import mysql2 from 'mysql2/promise'

const conexion = await mysql2.createConnection({
  host: process.env.BD_HOST,
  user:process.env. BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  port: process.env.BD_PORT
})

export default conexion

// const miresultado = await conexion.query(
//   `SELECT * FROM tblusuarios`
// )

// console.log(miresultado);