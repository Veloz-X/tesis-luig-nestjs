import { IsEmail, IsIn, IsInt, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class Token2fa {
    @IsString()
    token: string;

}