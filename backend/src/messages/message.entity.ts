import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  from: string;

  @Column('text')
  text: string;

  @Column()
  at: string;

  @CreateDateColumn()
  createdAt: Date;
}
