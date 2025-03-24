import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { prisma } from '../../config/db';
dotenv.config();

const secret = process.env.JWT_SECRET;
export const login = async (userData: LoginDto) => {
    const { password, email } = userData;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        throw new Error(`User not found`)
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error(`Invalid password`);
    }
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ email: user.email, role: user.role, status: user.status }, secret, { expiresIn: '24h' });
    const payload = {
        email: user.email,
        role: user.role,
        status: user.status
    }
    return { access_token: token, payload: payload };
}

export const register = async (userData: RegisterDto) => {
    const {password, email} = userData;
    const areUserRegistered = await prisma.user.findUnique({ where: { email: email } });
    if(areUserRegistered){
        throw new Error("User already exist");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data:{
            ...userData,
            status: 'ACTIVE',
            role: 'USER',
            password: hashedPassword
        }
    })

    return {name:user.name, email: user.email}

}