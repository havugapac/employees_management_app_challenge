import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role as RoleEnum } from '../enum/role.enum';
import { AbstractEntity } from "../../_grobal_config/entities/abstract.entity";

@Entity('roles')
export class Role extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: RoleEnum,
    unique: true,
  })
  name: RoleEnum;
}
