import { Client } from "pg";
import { configDotenv } from 'dotenv'
configDotenv()

 const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: process.env.DB_PASSWORD || 'rootuser',
    database: 'sellon'
})

export default client