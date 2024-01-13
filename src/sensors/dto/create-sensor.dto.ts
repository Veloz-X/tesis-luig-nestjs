import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSensorDto {
    @IsString()
    @MinLength(1)
    humidity: string;
    
    @IsString()
    @MinLength(1)
    temperature: string;
    
    @IsBoolean()    
    // @IsOptional()
    sensorStatus: boolean;
}
