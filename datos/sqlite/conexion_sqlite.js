import { AsyncDatabase } from 'promised-sqlite3'

export class DB {
  static #db

  static async close () {
    if (this.#db !== undefined) {
      this.#db.close()
      this.#db = undefined
    }
  }

  // Forma Asyncrona
  static async open () {
    if (this.#db === undefined) {
      // console.log(process.env.SQLITEPATHDB)
      this.#db = await AsyncDatabase.open(process.env.SQLITEPATHDB)
      this.#db.inner.on('trace', (sql) => console.log('[TRAZADO]', sql))
    }
    return this.#db
  }
}
