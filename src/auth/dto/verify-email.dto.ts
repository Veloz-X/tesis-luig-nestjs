import { IsEmail, IsIn, IsInt, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class verifyEmail {
    @IsString()
    email: string;

}