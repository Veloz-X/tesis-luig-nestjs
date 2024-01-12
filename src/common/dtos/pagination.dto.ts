import { Type } from "class-transformer";
import { IsOptional, IsPositive, Length, Min } from "class-validator";

export class PaginationDto{
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @Type(() => String)
    country?:  string;

    @IsOptional()
    @Type(() => String)
    uni?:  string;
}