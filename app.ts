import express from 'express'
import userRouter from './routes/user.route'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import productRouter from './routes/product.route'

export const app = express()

app.use(express.json({ limit: '10mb'}))
app.use(cookieParser())
app.use(cors({credentials: true}))

app.use('/api/v1', userRouter, productRouter)
