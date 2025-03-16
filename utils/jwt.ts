import jwt, { decode } from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
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

// Token for user
export const generateUserToken = (id: string) => {
    return jwt.sign({id}, secretKey, {
        expiresIn: '7d'
    })
} 