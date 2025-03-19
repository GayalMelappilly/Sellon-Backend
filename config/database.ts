import { Client } from "pg";
import { configDotenv } from 'dotenv'
configDotenv()

 const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

export default client