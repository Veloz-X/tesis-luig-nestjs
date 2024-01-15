import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSensorDto {
    @MinLength(1)
    humidity: number;
    
    @MinLength(1)
    temperature: number;
    
    @IsBoolean()    
    sensorStatus: boolean;
}
