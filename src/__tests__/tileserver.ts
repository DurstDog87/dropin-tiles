import { Tileserver } from "../index"
import { Pool } from "pg"
import "dotenv/config"

const pool = new Pool({
    user: process.env.TEST_USER,
    password: process.env.TEST_PWD,
    database: process.env.TEST_DB,
    host: process.env.HOST,
    port: 5432
})


const tileserver = new Tileserver(pool)
