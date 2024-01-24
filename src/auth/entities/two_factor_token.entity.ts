import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('two_factor_token')
export class TwoFactorToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
