import express from 'express'
import userRouter from './routes/user.route'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

app.use('/api/v1', userRouter)
