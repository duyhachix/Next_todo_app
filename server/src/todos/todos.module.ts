// standard library
import { Module } from '@nestjs/common';
import { Todos } from 'src/database/entity/todos.entity';
import { JwtService } from '@nestjs/jwt';
// internal library
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/database/entity/users.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todos, Users])],
  controllers: [TodosController],
  providers: [TodosService, JwtService, UsersService, AuthService],
  exports: [TypeOrmModule, TodosService],
})
export class TodosModule {}
