import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

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
