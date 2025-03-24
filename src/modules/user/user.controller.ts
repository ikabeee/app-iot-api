import { Request, Response } from "express";
import { createUser, getUserById, getUsers } from "./user.service";

export const createUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        const user = await createUser(data);
        res.status(200).json({ message: `User created successfully`, data: user });
        return;
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
        return;
    }
}

export const getUsersController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.status(200).json({ users })
        return;
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
    }
}

export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const user = await getUserById(+id);
        if(!user){
            res.status(404).json({ httpCode: 404, error: `User with id ${id} not found`, timestamp: new Date() })
            return;
        }
        res.status(200).json({ user })
        return;
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
    }
}