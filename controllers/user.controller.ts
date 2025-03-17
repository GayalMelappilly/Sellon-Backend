import { NextFunction, Request, Response } from "express"
import client from "../config/database"
import { hashPassword, matchPassword } from "../utils/bcrypt";
import { getCurrentUserQuery, loginUserQuery, signUpUserQuery, updateUserProfileQuery } from "../query/user.query";
import { sendVerificationMail } from "../utils/nodemailer";
import { decodeToken, generateOtpToken, sendTokens, updateTokens, verifyOtpToken, verifyToken } from "../utils/jwt";
import admin from "../utils/firebaseAdmin";
import { auth } from "firebase-admin";
import { FirebaseAppError } from "firebase-admin/app";
import { configDotenv } from "dotenv";
configDotenv()

export const signUpUser = async (req: Request, res: Response):Promise<void> => {

    const user = req.body

    const hashedPassword = await hashPassword(user.password)

    try {
        const result = await client.query(signUpUserQuery, [
            user.first_name,
            user.last_name,
            user.email,
            hashedPassword,
            user.phone_number,
            user.address,
            user.role,
            user.avatar,
            user.status
        ])

        res.status(201).send({
            message: `USER CREDS : ${user}`
        })
        return;

    } catch (err) {
        console.log("Error inserting user : ", err)
        res.status(500).json({
            message: 'Error inserting user'
        })
        return;
    }
}

export const loginUser = async (req: Request, res: Response):Promise<void> => {

    const { identifier, password } = req.body

    if (!identifier || !password) {
        res.status(422).json({
            message: 'Credentials were not provided'
        })
        return;
    }

    console.log('REACHED')

    try {
        const result = await client.query(loginUserQuery, [
            identifier
        ])

        if (result.rows.length > 0) {
            const user = result.rows[0]
            const isMatch = await matchPassword(password, user.password)
            if (isMatch) {
                const userId = result.rows[0].id
                const userDetails = result.rows[0]
                sendTokens(userId, userDetails, res)
                console.log("User logged in")
                return;
            } else {
                console.log("Invalid password")
                res.status(500).json({
                    message: "Invalid password"
                })
                return;
            }

        } else {
            res.status(500).json({
                message: 'User not found'
            })
            return;
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error fetching user details"
        })
        return;
    }

}

export const logoutUser = async (req: Request, res: Response):Promise<void> => {
    try {
        res.cookie('access_token', '', { maxAge: 1 })
        res.cookie('refresh_token', '', { maxAge: 1 })

        res.status(200).json({
            message: 'User logged out'
        })
        return;

    } catch (err) {
        res.status(500).json({
            message: "Logout error"
        })
        return;
    }
}

export const updateUserProfile = async (req: Request, res: Response):Promise<void> => {
    
    const userId = req.params.id
    const userUpdatedData = req.body
    
    try {
        await client.query(updateUserProfileQuery, [
            userUpdatedData.first_name,
            userUpdatedData.last_name,
            userUpdatedData.email,
            userUpdatedData.address,
            userUpdatedData.role,
            userUpdatedData.avatar,
            userId
        ])
        
        res.status(201).json({
            message: 'User updated successfully'
        })
        return;
    } catch (err) {
        console.log('User update error', err)
        res.status(500).json({
            message: 'User update error'
        })
        return;
    }
}

export const verifyUserWithEmail = async (req: Request, res: Response):Promise<void> => {
    
    const email = req.query.email as string
    const name = email.split('@')[0]
    const verificationOtp = Math.floor(100000 + Math.random() * 900000)
    
    const token = generateOtpToken(verificationOtp.toString())
    
    try {
        await sendVerificationMail(email, name, verificationOtp).then(() => {
            console.log("Email sent!")
            res.status(201).json({
                message: 'Email sent',
                token: token
            })
            return;
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
                message: 'An error occured while mail'
            })
            return;
        })
    } catch (err) {
        res.status(500).json({
            message: "An error occured while sending verification mail"
        })
        return;
    }
    
}

export const verifyEmailOtp = async (req: Request, res: Response):Promise<void> => {
    
    const { otp, token } = req.body
    
    try {
        const storedOtp = verifyOtpToken(token)
        
        if (storedOtp === otp) {
            res.status(200).json({
                message: 'Email verified'
            })
            return;
        } else {
            res.status(400).json({
                message: 'Invalid OTP'
            })
            return;
        }
    } catch (err) {
        res.status(400).json({
            message: err
        })
        return;
    }
    
    
}

export const verifyUserWithPhoneNumber = async (req: Request, res: Response):Promise<void> => {
    const phoneNumber = req.query.phone_number as string;
    
    if (!phoneNumber) {
        res.status(400).json({
            message: "Phone number is required"
        });
        return;
    }
    
    try {
        let userRecord: auth.UserRecord;
        
        try {
            userRecord = await admin.auth().getUserByPhoneNumber(`+91${phoneNumber}`);
        } catch (err: any) {
            if (err.code === 'auth/user-not-found') {
                console.log('User not found. Creating a new user...');
                
                userRecord = await admin.auth().createUser({
                    phoneNumber: `+91${phoneNumber}`
                });
            } else {
                console.error("Error while sending OTP", err);
                res.status(500).json({
                    message: 'Error while sending OTP',
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
                return;
            }
        }
        
        const token = await admin.auth().createCustomToken(userRecord.uid);
        console.log("OTP sent!")
        res.status(200).json({
            message: 'OTP sent successfully',
            token
        });
    } catch (err: unknown) {
        if (err instanceof FirebaseAppError) {
            console.error('Error sending OTP:', err.message);
            res.status(500).json({ message: 'Error sending OTP', error: err.message });
        } else if (err instanceof Error) {
            console.error('Unexpected Error:', err.message);
            res.status(500).json({ message: 'Unexpected error', error: err.message });
        } else {
            console.error('Unknown Error:', err);
            res.status(500).json({ message: 'Unknown error occurred' });
        }
        return;
    }
}

export const getAllUsers = async (req: Request, res: Response):Promise<void> => {

    try {
        const result = await client.query(updateUserProfileQuery)
        console.log('Fetched all users', result)
        res.status(200).json({
            message: 'Fetched all users',
            data: result.rows
        })
        return;
    } catch (err) {
        console.log('Error while fetching all users : ', err)
        res.status(500).json({
            message: 'Error while fetching all users',
            error: err
        })
        return;
    }
}

export const getCurrentUser = async (req: Request, res: Response):Promise<void> => {

    const token = req.cookies.token
    const id = decodeToken(token)?.id

    try{
        const result = await client.query(getCurrentUserQuery, [
            id
        ])
        console.log(result.rows)
        res.status(200).json({
            message: 'Fatched current user',
            data: result.rows
        })
    }catch(err){
        res.status(500).json({
            message: 'Error while fetching current user'
        })
        return
    }

}

export const updateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    
    try{
        const refreshToken = req.cookies.refresh_token as string
        const decodedToken = verifyToken(refreshToken)

        console.log("UPDATED TOKEN")

        if(!decodedToken){
            res.status(401).json({
                message: 'Token expired, login again'
            })
        }

        const userId = decodedToken?.id
        const userDetails = decodedToken?.user
        console.log(userId, userDetails)

        updateTokens(userId, userDetails, res, next)

    }catch(err: unknown){
        res.status(401).json({
            message: 'Token expired, login again'
        })
    }

}