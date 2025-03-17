import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv()

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.access_token;

    if(!token){
        res.status(401).json({
            message: 'Unauthorized user'
        })
        return;
    }
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        if(!decodedToken){
            res.status(401).json({
                message: 'Unauthorized user'
            })
            return;
        }
        next();
    }catch(error){
        console.log('Error while authenticating user',error)
        res.json({
            message: 'Error while authenticating user'
        })
        return;
    }

}