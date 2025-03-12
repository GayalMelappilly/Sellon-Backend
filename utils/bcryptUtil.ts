import bcrypt from 'bcrypt'
import { configDotenv } from 'dotenv'
configDotenv()

export const hashPassword = async (password: string) => {

    const saltRounds = Number(process.env.SALT_ROUNDS)
    return bcrypt.hash(password, saltRounds)

}

export const matchPassword = async (password: string, hashedPassword: string) => {

    const isMatch = await bcrypt.compare(password, hashedPassword)

    if(isMatch){
        return true
    }else{
        return false
    }

}
 
