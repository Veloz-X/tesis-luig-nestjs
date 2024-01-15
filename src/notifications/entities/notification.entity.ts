import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'notifications' })
export class Notification {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { default: '' })
    content: string;

    @Column( { default: false })
    notificationSent: boolean;

    @CreateDateColumn({
    })
    createDate: Date;
}
