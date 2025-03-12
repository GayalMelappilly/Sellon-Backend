import express from 'express'
import userRouter from './routes/user.route'

export const app = express()

app.use(express.json())

app.use('/api/v1', userRouter)
