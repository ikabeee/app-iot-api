// filepath: /home/ikabeee/Documents/github/app-iot-api/src/config/nodemailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};