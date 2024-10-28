import { PrimaryGeneratedColumn, Column} from 'typeorm';
  
  export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  }