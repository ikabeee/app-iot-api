import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const auth = (req: Request, res: Response, next: NextFunction): void => {
    const notAuthRequired = ['/api/login', '/api/register', '/api/verify-otp'];
    if(notAuthRequired.includes(req.url)) return next();
    const {access_token} = req.cookies;
    if(!access_token){
        res.status(403).send({ message: 'Access Denied', details: [{token: 'Not provided'}]});
        return; 
    } 
    try{
        jwt.verify(access_token.split(' ')[1], secret);
    }catch(error){
        res.status(403).send({message: 'Access Denied', details: [{token: 'Invalid'}]})
        return; 
    }
    return next();
}