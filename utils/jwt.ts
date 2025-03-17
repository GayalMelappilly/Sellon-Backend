import jwt, { decode } from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
import { UserModel } from '../models/user.model'
import { NextFunction, Response } from 'express'
import { redis } from '../config/redis'
configDotenv()

const secretKey = process.env.JWT_SECRET_KEY as string

// Generate otp token expires in 5 minutes
export const generateOtpToken = (otp: string) => {
    return jwt.sign({otp}, secretKey, {
        expiresIn: '5m'
    })
}

// Verify otp token
export const verifyOtpToken = (token: string) => {
    try{
        const decoded = jwt.verify(token, secretKey) as {otp: string}
        return decoded.otp
    }catch(err){
        console.error('Invalid token', err)
        throw new Error('Invalid token')
    }
}

// Generate access token and refresh token
export const sendTokens = (id: string, user: UserModel, res: Response) => {
    const accessToken = jwt.sign({id, user}, secretKey, {
        expiresIn: '5m'
    })
    const refreshToken = jwt.sign({id, user}, secretKey, {
        expiresIn: '3d'
    })

    // upload session to redis 
    redis.set(id, JSON.stringify(user) as any)

    const accessTokenExpire = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE || '300', 10)
    const refreshTokenExpire = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE || '1200', 10)

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000)
    })
    
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: refreshTokenExpire * 60 * 60 * 1000,
        expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000)
    })

    res.status(201).json({
        success: true,
        message: 'User logged in successfully',
        user,
        accessToken
    })
}

// Update access toke and refresh token
export const updateTokens = (id: string, user: UserModel, res: Response, next: NextFunction) => {
    const accessToken = jwt.sign({id, user}, secretKey, {
        expiresIn: '5m'
    })
    const refreshToken = jwt.sign({id, user}, secretKey, {
        expiresIn: '3d'
    })

    const accessTokenExpire = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE || '300', 10)
    const refreshTokenExpire = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE || '1200', 10)

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: accessTokenExpire * 60 * 60 * 1000,
        expires: new Date(Date.now() + refreshTokenExpire * 1000)
    })
    
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + accessTokenExpire * 1000)
    })

    next();
}

// Decode Token
export const decodeToken = (token: string) => {
    return jwt.decode(token, {json: true})
    
}

// Verify tokens
export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload
}