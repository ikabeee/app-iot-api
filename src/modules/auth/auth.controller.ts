import { Response, Request } from "express";
import session from "express-session";
import { plainToInstance } from 'class-transformer';

declare module "express-session" {
    interface SessionData {
        otpSecret: string;
    }
}

import { login, register, verifyOTP } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { validate } from "class-validator";
import { RegisterDto } from "./dto/register.dto";

export const loginController = async (req: Request, res: Response) => {
    try {
        const userData = plainToInstance(LoginDto, req.body);
        const errors = await validate(userData);
        if (errors.length > 0) {
            const validationErrors = errors.map(err => Object.values(err.constraints || {}));
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
        const { otpSecret } = await login(userData);
        
        // Guardamos el OTP en la sesión
        req.session.otpSecret = otpSecret;
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                throw new Error('Error saving session');
            }
            console.log('Session saved:', req.session);
        });

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error.message}`, timestamp: new Date() });
    }
}

export const verifyOTPController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, email } = req.body;
        console.log('Session in verifyOTP:', req.session);
        console.log('OTP Secret from session:', req.session.otpSecret);
        
        const otpSecret = req.session.otpSecret;
        if (!otpSecret) {
            throw new Error('OTP secret not found in session');
        }
        const { token: jwtToken, payload } = await verifyOTP(token, otpSecret, email);

        // Limpiamos el OTP de la sesión después de verificar
        delete req.session.otpSecret;
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
            }
        });

        res.cookie('access_token', jwtToken, {
            httpOnly: true,
            secure: false, // Mantenemos false para desarrollo
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        res.status(200).json({ payload });
    } catch (error: any) {
        console.error('OTP verification error:', error);
        res.status(400).json({ httpCode: 400, error: `OTP verification failed: ${error.message}`, timestamp: new Date() });
    }
};
export const registerController = async (req: Request, res: Response) => {
    try {
        const userData = plainToInstance(RegisterDto, req.body);
        const errors = await validate(userData);
        if (errors.length > 0) {
            const validationErrors = errors.map(err => Object.values(err.constraints || {}));
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
        const { otpSecret } = await register(userData);
        req.session.otpSecret = otpSecret;
        res.status(201).json({ message: `User registered`, otpSecret });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error.message}`, timestamp: new Date() });
    }
}


export const logoutController = (req: Request, res: Response) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw new Error('Error al destruir la sesión');
            }
            res.clearCookie('access_token');
            res.status(200).json({ message: 'Logout exitoso' });
        });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Error inesperado: ${error.message}`, timestamp: new Date() });
    }
};
