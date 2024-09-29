import mssql from 'mssql'

const dbSetting = {
    user: process.env.SQLSERVER_BD_USER,
    password: process.env.SQLSERVER_BD_PASSWORD,
    server: process.env.SQLSERVER_BD_HOST,
    port: Number(process.env.SQLSERVER_BD_PORT),
    database: process.env.SQLSERVER_BD_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        instancesname: process.env.SQLSERVER_BD_INSTANCENAME
    }
}

export const getConnection = async () => {
    try{
        const pool = await mssql.connect(dbSetting)
        const result = await pool.request().query("select GETDATE()")
        console.log(result);
        console.log("HOLA");
        
        return pool
    }catch (error) {
        console.log(error);
    }
}



// USO DEL SQL SERLVER
// import { getConnection } from './../database/connection.js'
// import sql from 'mssql'

// export const getProducts = async (req, res) => { 
//   const pool = await getConnection()
//   const result = await pool.request().query('SELECT * FROM products')
//   console.table(result);
//   res.json(result.recordset)
// }

// export const getProduct = async (req, res) => { 
//   const pool = await getConnection()
//   const result = await pool.request()
//     .input("id", sql.Int, req.params.id)
//     .query(`SELECT * FROM products where id = @id`)
    
//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).json({ message: "Producto No Encontrado"})
//     }
//   res.json(result.recordset[0])
// }

// export const createProduct = async (req, res) => { 
//   console.log(req.body);
//   const pool = await getConnection()
//   const reusult = await pool.request()
//     .input('name', sql.VarChar, req.body.name)
//     .input('description', sql.Text, req.body.description)
//     .input('quantity', sql.Int, req.body.quantity)
//     .input('price', sql.Decimal, req.body.price)
//     .query(`
//       INSERT INTO 
//         products
//         (name, description, quantity, price) 
//       VALUES 
//         (@name, @description, @quantity, @price);
//       SELECT SCOPE_IDENTITY() as Id;`)
//   console.log(reusult);
  
//   res.send({
//     id: reusult.recordset[0].Id,
//     name: req.body.name,
//     description: req.body.description,
//     quantity: req.body.quantity,
//     price: req.body.price
//   })
// }

// export const updateProduct = async (req, res) => { 
//   const pool = await getConnection()
//   const result = await pool.request()
//     .input('id', sql.VarChar, req.params.id)
//     .input('name', sql.VarChar, req.body.name)
//     .input('description', sql.Text, req.body.description)
//     .input('quantity', sql.Int, req.body.quantity)
//     .input('price', sql.Decimal, req.body.price)
//     .query(`
//       UPDATE 
//         products
//         SET
//         name = @name, description = @description,
//         quantity = @quantity, price = @price 
//       WHERE id = @id
//       `)

//       if (result.rowsAffected[0] === 0) {
//         return res.status(404).json({ message: "Producto No Encontrado"})
//       }
//       res.send({
//         id: req.params.id,
//         name: req.body.name,
//         description: req.body.description,
//         quantity: req.body.quantity,
//         price: req.body.price
//       })

// }

// export const deleteProduct =  async (req, res) => { 
//   const pool = await getConnection()
//   const result = await pool.request()
//     .input("id", sql.Int, req.params.id)
//     .query(`DELETE FROM products where id = @id`)
    
//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).json({ message: "Producto No Encontrado"})
//     }
//   res.json({ message: "Producto Eliminado"} )
// }

