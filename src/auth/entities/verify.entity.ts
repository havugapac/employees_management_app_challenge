import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('verify')
export class Verify {
  @PrimaryGeneratedColumn()
  id: number;
    
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: number;

  @Column()
  token: string;
}

