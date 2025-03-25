import { Response, Request } from "express";
import session from "express-session";

declare module "express-session" {
    interface SessionData {
        otpSecret: string;
    }
}

import { login, register, verifyOTP } from "./auth.service";

export const loginController = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const { otpSecret } = await login(userData);
        req.session.otpSecret = otpSecret;
        res.status(200).json({ message: 'OTP sent to email', otpSecret });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error.message}`, timestamp: new Date() });
    }
}

export const registerController = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const { otpSecret } = await register(userData);
        req.session.otpSecret = otpSecret;
        res.status(201).json({ message: `User registered`, otpSecret });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error.message}`, timestamp: new Date() });
    }
}

export const verifyOTPController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, email } = req.body;
        const otpSecret = req.session.otpSecret;
        if (!otpSecret) {
            throw new Error('OTP secret not found in session');
        }
        const { token: jwtToken, payload } = await verifyOTP(token, otpSecret, email);

        res.cookie('access_token', jwtToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({ payload });
    } catch (error: any) {
        res.status(400).json({ httpCode: 400, error: `OTP verification failed: ${error.message}`, timestamp: new Date() });
    }
};