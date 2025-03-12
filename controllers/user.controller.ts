import { Request, Response } from "express"
import client from "../config/database"
import { hashPassword } from "../utils/hastPasswords";
import { signUpUserQuery } from "../query/user.query";

export const signUpUser = async (req: Request, res: Response) => {
    const user = req.body

    const hashedPassword = await hashPassword(user.password)
    console.log("HASHED PASSWORD : ",hashedPassword)

    try{
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
        console.log("Added new user")
    }catch (err) {
        console.log("Error inserting user : ",err)
    }

    res.status(201).send({
        message: `USER CREDS : ${user}`
    })
}

export const loginUser = async (req: Request, res: Response) => {
    
    // const query = `
        
    // `

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