import mysql2 from 'mysql2/promise'

const conexion = await mysql2.createConnection({
  host: process.env.MYSQL_BD_HOST,
  user:process.env. MYSQL_BD_USER,
  password: process.env.MYSQL_BD_PASSWORD,
  database: process.env.MYSQL_BD_DATABASE,
  port: process.env.MYSQL_BD_PORT
})

export default conexion

// const miresultado = await conexion.query(
//   `SELECT * FROM tblusuarios`
// )

// console.log(miresultado);