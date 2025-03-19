import express from 'express'
import { getAllUsers, signUpUser, loginUser, updateUserProfile, verifyUserWithEmail, verifyUserWithPhoneNumber, verifyEmailOtp, logoutUser, getCurrentUser, updateAccessToken } from '../controllers/user.controller'
import { isAuthenticated } from '../middlewares/auth'
import { authorizeRoles } from '../middlewares/authorizedRole'

const userRouter = express.Router()

userRouter.post('/sign-up', signUpUser)
userRouter.get('/verify-user-with-email/email', verifyUserWithEmail)
userRouter.post('/verify-user-with-email/', verifyEmailOtp)
userRouter.get('/verify-user-with-otp/phone_number', verifyUserWithPhoneNumber)
userRouter.post('/login', loginUser)
userRouter.get('/logout', isAuthenticated, logoutUser)
userRouter.get('/get-all-users', getAllUsers)
userRouter.get('/get-current-user', isAuthenticated, updateAccessToken, getCurrentUser)
userRouter.put('/update-user-profile/:id', isAuthenticated, updateUserProfile) 

export default userRouter