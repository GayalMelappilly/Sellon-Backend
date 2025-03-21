import http from 'http'
import { app } from './app'
import client from './config/database'

const server = http.createServer(app)

server.listen(5000, async () => {
    await client.connect().then(() => {
        console.log('Database connected successfully')
    }).catch((err) => {
        console.log('Database connection error : ', err)
    })
    console.log('Server running on port 5000')
})