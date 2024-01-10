import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('params')
export class ParamsEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  alias: string

  @Column({type: 'text'})
  params: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}