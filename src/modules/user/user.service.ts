import { User } from "@prisma/client";
import { prisma } from "../../config/db";
import * as bcrypt from 'bcrypt';

export const createUser = async(userData: User): Promise<User> =>{
    const {password} = userData;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({data: {
        ...userData,
        password: hashPassword
    }});
    return user;
}

export const getUsers=async(): Promise<User[]>=>{
    const users = await prisma.user.findMany();
    return users;
}

export const getUserById = async(id: number): Promise<User | null> =>{
    const user = await prisma.user.findUnique({where: {id}});
    return user;
}