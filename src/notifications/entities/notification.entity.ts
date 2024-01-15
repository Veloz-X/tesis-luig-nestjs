import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'notifications' })
export class Notification {

    @PrimaryGeneratedColumn('uuid')
    id: string;
}
