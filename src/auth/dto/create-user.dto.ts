import { IsEmail, IsIn, IsInt, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    country: string;

    @IsString()
    uni: string;

    @IsString()
    @IsIn(['man','woman','other'])
    gender: string;

    @IsInt()
    age: number;
}