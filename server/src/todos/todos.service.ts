// standard libraries
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const todoListthis = await this.todoRepository.find({
      where: { users: { email: user.email } },
      relations: { users: true },
    });
    return todoListthis;
  }

  async updateTodo(user: Users, updateTodoDto: any, id: number) {
    const todo = await this.todoRepository.findOne({
      where: { users: { email: user.email }, id: id },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return await this.todoRepository.save({
      ...todo,
      ...updateTodoDto,
    });
  }

  async delete(user: Users, id: number) {
    const userdetail = await this.usersService.getUserByEmail(user.email);
    const userId = userdetail.id;

    const todo = await this.todoRepository.findOne({
      where: { userId: userId, id: id },
    });

    if (!todo) {
      throw new NotFoundException('Can not found item');
    }

    return await this.todoRepository.delete({ id: id });
  }
}
