import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Todos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  status: string;

  @Column({
    nullable: true,
    default: null,
  })
  userId: number;

  @ManyToOne(() => Users, (users) => users.todos)
  @JoinColumn({ name: 'userId' })
  users: Users;
}
