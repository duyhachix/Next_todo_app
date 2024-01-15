import {
  Controller,
  Get,
  Post,
  // Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthenticationGuard } from '../auth/guard/authentication.guard';
import { TodosService } from '../todos/todos.service';
import { CreateTodoDto } from './dtos/CreateTodoDto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/decorator/user.decorator';
import { Users } from 'src/database/entity/users.entity';

@ApiTags('todos')
@Controller('todos')
@UseGuards(AuthenticationGuard)
export class TodosController {
  constructor(
    private todosService: TodosService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiBearerAuth()
  async create(
    @Req() req: Request,
    @Body() createTodoDto: CreateTodoDto,
    @User() user: Users,
  ) {
    const reponse = this.todosService.create(user, createTodoDto);
    return {
      message: 'Create todo successfully',
      data: reponse,
    };
  }

  @Get()
  @ApiBearerAuth()
  async findAll(@Req() req: Request, @User() user: Users) {
    const response = await this.todosService.getAllTodobyUser(user);
    if (response.length === 0)
      return {
        message: 'List empty',
        data: response,
      };
    return {
      message: 'Get all todos list successfully',
      data: response,
    };
  }

  // @Delete(':id')
  // async delete(@Req() req: Request, @Param('id') todoId: number) {
  //   const { user } = req;
  //   return this.todosService.delete(user.id, todoId);
  // }
}
