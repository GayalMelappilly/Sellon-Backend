import { Request, Response } from "express"
import client from "../config/database"
import { hashPassword, matchPassword } from "../utils/bcryptUtil";
import { loginUserQuery, signUpUserQuery } from "../query/user.query";

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
    
    const query = `
        SELECT * FROM USERS
    `

    try{
        const result = await client.query(query)
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