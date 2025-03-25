import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { prisma } from '../../config/db';
import { sendEmail } from './../../config/nodemailer';
dotenv.config();

const secret = process.env.JWT_SECRET;

export const login = async (userData: LoginDto) => {
    const { password, email } = userData;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    const otpSecret = generateSecret();
    const otp = generateOTP(otpSecret.base32);
    await sendOTP(email, otp);

    return { otpSecret: otpSecret.base32 };
};

export const register = async (userData: RegisterDto) => {
    const { name, email, password } = userData;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            status: 'ACTIVE',
            role: 'USER',
        },
    });
    const otpSecret = generateSecret();
    const otp = generateOTP(otpSecret.base32);
    await sendOTP(email, otp);
    return { otpSecret: otpSecret.base32 };
};

export const verifyOTP = async (token: string, secret: string, email: string) => {
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
    });
    if (!verified) {
        throw new Error('Invalid OTP');
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
    };
    const jwtToken = jwt.sign(payload, secret, { expiresIn: '24h' });
    return { token: jwtToken, payload };
};

export const generateSecret = () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret;
};

export const generateOTP = (secret: string) => {
    const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
    });
    return token;
};

export const sendOTP = async (email: string, otp: string) => {
    const subject = 'Your OTP Code';
    const message = `Your OTP code is ${otp}`;
    await sendEmail(email, subject, message);
};