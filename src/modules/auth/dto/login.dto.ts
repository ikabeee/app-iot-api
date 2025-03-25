import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}