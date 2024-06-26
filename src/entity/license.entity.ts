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

  @Column({type: 'text', default: 'default'})
  type: string

  @Column({type: 'text', nullable: true})
  userName: string

  @Column({type: 'text', nullable: true})
  email: string

  @Column({type: 'text', nullable: true})
  birthDate: string

  @Column({type: 'date', nullable: true})
  dateStart: Date

  @Column({type: 'bit', default: 0})
  isSendEmail: boolean


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}