import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSensorDto {
    @IsString()
    @MinLength(1)
    humidity: number;
    
    @IsString()
    @MinLength(1)
    temperature: number;
    
    @IsBoolean()    
    // @IsOptional()
    sensorStatus: boolean;
}
