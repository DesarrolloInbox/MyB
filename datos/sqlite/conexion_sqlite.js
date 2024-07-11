import x from 'sqlite3'
import { AsyncDatabase }  from 'promised-sqlite3';

const sqlite3 = x.verbose()

export class DB {
  static #db

  // Forma Syncrona
  // static open () {
  //   if (this.#db === undefined) {
  //     this.#db = new sqlite3.Database(process.env.SQLITEPATHDB, (error) => {
  //       if (error) {
  //         console.log(error.message)
  //       } else {
  //         console.log('La Conexión esta lista')
  //       }
  //     })
  //   }
  //   return this.#db
  // }

  static async close () {
    if (this.#db !== undefined) {
      this.#db.close()
      this.#db = undefined
    }
  }

  // Forma Asyncrona
  static async open () {
    if (this.#db === undefined) {
      this.#db = await AsyncDatabase.open(process.env.SQLITEPATHDB)
      this.#db.inner.on('trace', (sql) => console.log('[TRAZADO]', sql))
    }
    return this.#db
  }
}
