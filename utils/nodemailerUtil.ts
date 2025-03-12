import nodemailer from 'nodemailer'
import { configDotenv } from 'dotenv'
configDotenv()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD
    }
})