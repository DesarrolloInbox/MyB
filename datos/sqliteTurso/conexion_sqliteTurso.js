import { createClient } from '@libsql/client'

const conexion = createClient({
  url: 'libsql://general-desarrolloinbox.turso.io',
  authToken: process.env.tokenSQLite
})

export default conexion

// const result = await connection.execute({
//     sql: "SELECT * FROM tblusuarios ",
//     args: [],
//   })
// console.log(result)
