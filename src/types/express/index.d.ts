import { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload & {
            id: number;
            email: string;
            role: string;
            status: string;
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
                status: string;
            };
        }
    }
}