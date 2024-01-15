// standard libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
// internal libraries
import { Todos } from '../database/entity/todos.entity';
import { UsersService } from '../users/users.service';
import { Users } from 'src/database/entity/users.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todos)
    private todoRepository: Repository<Todos>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async create(user: Users, newTodoItem: any) {
    const userdetail = await this.usersService.getUserByEmail(user.email);
    const userId = userdetail.id;
    const todo = this.todoRepository.create({
      ...newTodoItem,
      userId,
    });

    return this.todoRepository.save(todo);
  }

  async getAllTodobyUser(user: Users) {
    const userdetail = await this.usersService.getUserByEmail(user.email);
    const userId = userdetail.id;

    const todoListthis = await this.todoRepository.find({
      where: { userId: userId },
    });
    return todoListthis;
  }

  // async delete(username: string, todoId: number) {
  //   const todo = await this.todoRepository.findOne({ id: todoId, username });
  //   if (!todo) {
  //     throw new Error('Todo not found');
  //   }
  //   return this.todoRepository.remove(todo);
  // }
}
