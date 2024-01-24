import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('two_factor_token')
export class TwoFactorToken {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
  token: string;

  @CreateDateColumn({
  })
  createDate: Date;

  @UpdateDateColumn({
  })
   updateDate: Date;

  @OneToOne(
    () => User,
    (user) => user.two_factor_token,
  )
  user: User;
}
