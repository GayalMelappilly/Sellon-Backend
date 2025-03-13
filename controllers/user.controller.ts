import { Request, Response } from "express"
import client from "../config/database"
import { hashPassword, matchPassword } from "../utils/bcryptUtil";
import { loginUserQuery, signUpUserQuery, updateUserProfileQuery } from "../query/user.query";
import { sendVerificationMail } from "../utils/nodemailerUtil";
import { generateOtpToken, verifyOtpToken } from "../utils/jwtUtil";

export const signUpUser = async (req: Request, res: Response) => {

    const user = req.body

    const hashedPassword = await hashPassword(user.password)

    try{
        await client.query(signUpUserQuery, [
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
    }catch (err) {
        console.log("Error inserting user : ",err)
        res.status(500).json({
            message: 'Error inserting user'
        })
    }

    res.status(201).send({
        message: `USER CREDS : ${user}`
    })
}

export const loginUser = async (req: Request, res: Response) => {
    
    const loginDetails = req.body

    try{
        const result = await client.query(loginUserQuery, [
            loginDetails.identifier
        ])

        if(result.rows.length > 0){
            const user = result.rows[0]
            const isMatch = await matchPassword(loginDetails.password, user.password)
            if(isMatch){
                console.log("User logged in")
                res.status(201).json({
                    message: "User logged in successfully"
                })
            }else{
                console.log("Invalid password")
                res.status(500).json({
                    message: "Invalid password"
                })
            }

        }else{
            res.status(500).json({
                message: 'User not found'
            })
        }

    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error fetching user details"
        })
    }

}

export const getAllUsers = async (req: Request, res: Response) => {

    try{
        const result = await client.query(updateUserProfileQuery)
        console.log('Fetched all users', result)
        res.status(200).json({
            message: 'Fetched all users',
            data: result.rows
        })
    }catch(err){
        console.log('Error while fetching all users : ',err)
        res.status(500).json({
            message: 'Error while fetching all users',
            error: err
        })
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {

    const userId = req.params.id
    const userUpdatedData = req.body

    try{
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
    }catch(err){
        console.log('User update error', err)
        res.status(500).json({
            message: 'User update error'
        })
    }
}

export const verifyUserWithEmail = async (req: Request, res: Response) => {

    const email = req.query.email as string
    const name = email.split('@')[0]
    const verificationOtp = Math.floor(100000 + Math.random() * 900000)

    const token = generateOtpToken(verificationOtp.toString())

    try{
        await sendVerificationMail(email, name, verificationOtp).then(()=>{
            console.log("Email sent!")
            res.status(201).json({
                message: 'Email sent',
                token: token
            })
        }).catch((err)=>{
            console.log(err)
        })
    }catch(err){
        res.status(500).json({
            message: "An error occured while sending verification mail"
        })
    }

}

export const verifyEmailOtp = async (req: Request, res: Response) => {

    const {otp, token} = req.body 

    try{
        const storedOtp = verifyOtpToken(token)

        if (storedOtp === otp){
            res.status(200).json({
                message: 'Email verified'
            })
        }else{
            res.status(400).json({
                message: 'Invalid OTP'
            })
        }
    }catch(err){
        res.status(400).json({
            message: err
        })
    }
    

}

export const verifyUserWithPhoneNumber = async (req: Request, res: Response) => {

}