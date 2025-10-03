import pg from "pg"
const { Pool } = pg
const pool = new Pool()

pool.use({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "coins",
    port: 5432
})

export default {pool}