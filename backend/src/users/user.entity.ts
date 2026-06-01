import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export type UserPlan = 'free' | 'gold' | 'platinum';
export type UserStatus = 'active' | 'suspended' | 'pending_verification';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false }) // Never returned in queries by default
  password: string;

  @Column({ nullable: true, length: 20 })
  dob: string;

  @Column({ nullable: true, length: 30 })
  gender: string;

  // ─── Extended profile fields ──────────────────────────────────────────────

  @Column({ nullable: true, length: 150 })
  profession: string;

  @Column({ nullable: true, length: 20 })
  height: string;

  @Column({ nullable: true, length: 150 })
  city: string;

  /** Comma-separated interest tags, e.g. "Coffee,Design,Hiking" */
  @Column({ nullable: true, length: 500 })
  interests: string;

  /** Comma-separated personality tags, e.g. "Curious,Witty" */
  @Column({ nullable: true, length: 300 })
  personality: string;

  @Column({ nullable: true, length: 500 })
  bio: string;

  @Column({ nullable: true, type: 'text' })
  avatarUrl: string;

  @Column({ nullable: true, length: 500 })
  hobbies: string;

  // ─── Subscription & status ────────────────────────────────────────────────

  @Column({ type: 'enum', enum: ['free', 'gold', 'platinum'], default: 'free' })
  plan: UserPlan;

  @Column({ type: 'enum', enum: ['active', 'suspended', 'pending_verification'], default: 'active' })
  status: UserStatus;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  onboardingCompleted: boolean;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
