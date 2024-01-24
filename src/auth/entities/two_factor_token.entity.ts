import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('two_factor_token')
export class TwoFactorToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @CreateDateColumn({
  })
  createDate: Date;

  @UpdateDateColumn({
  })
   updateDate: Date;
}
