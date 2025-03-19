import express, { NextFunction, Request, Response } from 'express'
import { decodeIdFromToken, decodeToken } from '../utils/jwt'
import { redis } from '../config/redis'
import { getUserCache } from '../utils/redis'

export const authorizeRoles = (...roles: string[])=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        const user = await getUserCache(req.cookies.access_token)
        if(!roles.includes(user?.role || '')){
            return next(new Error(`Role : ${user?.role} is not allowed to access this resource`))
        }
        next()
    }
}