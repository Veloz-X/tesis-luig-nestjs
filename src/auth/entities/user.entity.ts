import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @BeforeInsert()
    checkEmailInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailUpdate() {
        this.email = this.email.toLowerCase().trim();
    }

}

@Entity('two_factor_token')
export class TwoFactorToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

@Entity('two_factor_confirmation')
export class TwoFactorConfirmation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isConfirmed: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
