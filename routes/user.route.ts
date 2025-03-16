import express from 'express'
import { getAllUsers, signUpUser, loginUser, updateUserProfile, verifyUserWithEmail, verifyUserWithPhoneNumber, verifyEmailOtp, logoutUser, getCurrentUser } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/sign-up', signUpUser)
userRouter.get('/verify-user-with-email/email', verifyUserWithEmail)
userRouter.post('/verify-user-with-email/', verifyEmailOtp)
userRouter.get('/verify-user-with-otp/phone_number', verifyUserWithPhoneNumber)
userRouter.post('/login', loginUser)
userRouter.get('/logout', logoutUser)
userRouter.get('/get-all-users', getAllUsers)
userRouter.get('/get-current-user', getCurrentUser)
userRouter.put('/update-user-profile/:id', updateUserProfile) 

export default userRouter