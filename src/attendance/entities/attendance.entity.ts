import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: Number; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  arrival_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  leave_time: Date;
}

