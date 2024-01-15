import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todos } from './todos.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  // @Index()
  email: string;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  username: string;

  @OneToMany(() => Todos, (todos) => todos.users)
  todos: Todos[];
}
