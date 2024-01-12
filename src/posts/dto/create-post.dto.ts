import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePostDto {
    @IsString()
    @MinLength(1)
    content: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
    
    @IsInt()
    @IsOptional()
    reports: number;

    @IsBoolean()    
    @IsOptional()
    isActive: boolean;

    @IsString()
    @IsOptional()
    campus: string;

    @IsBoolean()    
    @IsOptional()
    isAnonymous: boolean;

    @IsString({each: true})
    @IsArray()
    // TODO: ARREGLAR ESTE BUG
    // @IsIn(["love","gossip","anecdote","other","ask"])
    @IsOptional()
    categories: string[];
}
