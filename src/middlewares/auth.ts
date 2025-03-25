import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const notAuthRequired = ['/login', '/register', '/verify-otp'];
    if(notAuthRequired.includes(req.url)) return next();
    const {access_token} = req.cookies;
    if(!access_token) return res.status(403).send({ message: 'Access Denied', details: [{token: 'Not provided'}]});
    try{
        jwt.verify(access_token.split(' ')[1], secret);
    }catch(error){
        return res.status(403).send({message: 'Access Denied', details: [{token: 'Invalid'}]})
    }
    return next();
}