import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSensorDto {
    humidity: number;
    
    temperature: number;
    
    @IsBoolean()    
    sensorStatus: boolean;
}
