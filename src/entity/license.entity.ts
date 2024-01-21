import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('license')
export class LicenseEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  key: string

  @Column({type: 'bit', default: 1})
  isActive: boolean

  @Column({type: 'text', nullable: true})
  data: string

  @Column({type: 'int', default: 0})
  step: number

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}