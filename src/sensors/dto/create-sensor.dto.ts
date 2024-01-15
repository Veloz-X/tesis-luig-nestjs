import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSensorDto {
    @IsOptional() 
    humidity?: number;
    
    @IsOptional() 
    temperature?: number;
    
    @IsBoolean()    
    sensorStatus: boolean;
}
