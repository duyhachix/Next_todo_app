import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  // Delete,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthenticationGuard } from '../auth/guard/authentication.guard';
import { TodosService } from '../todos/todos.service';
import { CreateTodoDto } from './dtos/CreateTodoDto';
import { UpdateTodoDto } from './dtos/UpdateTodoDto';
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
    const response = await this.todosService.create(user, createTodoDto);
    console.log('create response', response);

    return {
      message: 'Create todo successfully',
      data: response,
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

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @Req() req: Request,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: Users,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.todosService.updateTodo(
      user,
      updateTodoDto,
      id,
    );
    console.log('response', response);

    return {
      message: 'Update todo successfully',
      data: response,
    };
  }

  // @Delete(':id')
  // async delete(@Req() req: Request, @Param('id') todoId: number) {
  //   const { user } = req;
  //   return this.todosService.delete(user.id, todoId);
  // }
}
