import { Response, Request } from "express";
import { login, register } from "./auth.service";

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