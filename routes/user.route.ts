import express from 'express'
import { getAllUsers, signUpUser, loginUser } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/sign-up', signUpUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-all-users', getAllUsers)

export default userRouter