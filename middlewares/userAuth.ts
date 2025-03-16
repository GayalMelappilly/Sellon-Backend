import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv()

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: 'Unauthorized user'
        })
    }

    try{

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string)

    }catch(error){
        console.log('Error while authenticating user',error)
        res.json({
            message: 'Error while authenticating user'
        })
    }

}