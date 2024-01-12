import { IsArray, IsBoolean, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
export class CreateCommentDto {
    @IsString()
    @MinLength(1)
    content: string;
    
    @IsInt()
    @IsOptional()
    reports: number;

    @IsBoolean()    
    @IsOptional()
    isActive: boolean;
}
