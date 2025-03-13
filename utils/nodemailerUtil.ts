import nodemailer from 'nodemailer'
import { configDotenv } from 'dotenv'
import ejs from 'ejs'
import path from 'path'
configDotenv()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_MAIL_ID,
        pass: process.env.SMTP_PASSWORD
    }
})

export const sendVerificationMail = async (email: string, name: string, verificationCode: number) => {

    const templatePath = path.join(__dirname, '../views/mails/verification-mail.ejs')

    const html = await ejs.renderFile(templatePath, {
        name: name,
        code: verificationCode
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL_ID,
        to: email,
        subject: 'Welcome!',
        html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log("Nodemailer error : ",error)
        }
    })

}