import { Request, Response } from "express";
import { createUser, getUsers } from "./user.service";

export const createUserController = async(req: Request, res: Response): Promise<void> => {
    try{
        const data = req.body;
        const user = await createUser(data);
        res.status(200).json({message: `User created successfully`, data: user});
        return;
    }catch(error: unknown){
        res.status(500).json({httpCode:500, error: `Unexpected error ${error}`, timestamp: new Date()});
        return;
    }
}

export const getUsersController = async(_req: Request, res: Response): Promise<void> =>{
    try{
        const users = await getUsers();
        res.status(200).json({users})
        return;
    }catch(error: unknown){
        res.status(500).json({httpCode:500, error: `Unexpected error ${error}`, timestamp: new Date()});
    }
}