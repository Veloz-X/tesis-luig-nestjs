import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity({ name: 'sensors' })
export class Sensor {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('bool', { default: true })
    sensorStatus: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    temperature: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    humidity: number;

    @CreateDateColumn({
    })
    createDate: Date;

    @UpdateDateColumn({
    })
    updateDate: Date

}
