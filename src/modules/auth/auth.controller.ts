import { Response, Request } from "express";
import { login, register, generateSecret, generateOTP, verifyOTP, sendOTP } from "./auth.service";

export const loginController = async(req: Request, res: Response) => {
    try{
        const userData = req.body;
        const tokenInfo = await login(userData);
        res.status(201).json({message: `User logged`, tokenInfo});
        return;
    }catch(error:any){
        res.status(500).json({httpCode:500, error: `Unexpected error`, timestamp: new Date()});
        return;
    }
}

export const registerController = async(req: Request, res: Response) =>{
    try{
        const userData = req.body
        const userRegister = await register(userData);
        res.status(201).json({message: `User registered`, userRegister});
        return;
    }catch(error: any) {
        res.status(500).json({httpCode:500, error: `Unexpected error ${error}`, timestamp: new Date()});
        return;
    }
}

export const generateOTPController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const secret = generateSecret();
        const otp = generateOTP(secret.base32);
        await sendOTP(email, otp);
        res.status(200).json({ secret: secret.base32, otp });
        return;
    } catch (error: unknown) {
        res.status(500).json({ error: `Unexpected error: ${error}`, timestamp: new Date() });
    }
};

export const verifyOTPController = (req: Request, res: Response): void => {
    try {
        const { token, secret } = req.body;
        const verified = verifyOTP(token, secret);
        if (verified) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
        return;
    } catch (error: unknown) {
        res.status(500).json({ error: `Unexpected error: ${error}`, timestamp: new Date() });
        return;
    }
};