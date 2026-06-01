import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MatchStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  BLOCKED = 'BLOCKED',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // The user who initiates the like

  @Column()
  targetProfileId: string; // The profile they liked

  @Column({
    type: 'varchar',
    default: MatchStatus.PENDING,
  })
  status: MatchStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
