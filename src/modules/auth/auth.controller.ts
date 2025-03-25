import { Response, Request } from "express";
import { login, register, verifyOTP } from "./auth.service";

export const loginController = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const { otpSecret } = await login(userData);
        res.status(200).json({ message: 'OTP sent to email', otpSecret });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error.message}`, timestamp: new Date() });
    }
}

export const registerController = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const userRegister = await register(userData);
        res.status(201).json({ message: `User registered`, userRegister });
    } catch (error: any) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error.message}`, timestamp: new Date() });
    }
}

export const verifyOTPController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, secret, email } = req.body;
        const { token: jwtToken, payload } = await verifyOTP(token, secret, email);

        res.cookie('access_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({ payload });
    } catch (error: any) {
        res.status(400).json({ httpCode: 400, error: `OTP verification failed: ${error.message}`, timestamp: new Date() });
    }
};