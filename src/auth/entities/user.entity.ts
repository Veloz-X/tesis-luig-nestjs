import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TwoFactorToken } from "./two_factor_token.entity";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column('text',{
        select: false
    })
    password: string;

    @Column('bool', { default: true })
    isActive: boolean;

    @Column('bool', { default: false })
    isTwoFactorEnabled: boolean;

    @Column('text', { array: true, default: ['user'] })
    roles: string[];

    @CreateDateColumn({
    })
    createDate: Date;

    @UpdateDateColumn({
    })
    updateDate: Date;

    @OneToOne(() => TwoFactorToken)
    @JoinColumn()
    two_factor_token: TwoFactorToken;

    @BeforeInsert()
    checkEmailInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailUpdate() {
        this.email = this.email.toLowerCase().trim();
    }

}