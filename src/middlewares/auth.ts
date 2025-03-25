import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Almacena la información del usuario en la solicitud
        next(); // Pasa el control al siguiente middleware o ruta
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }
};