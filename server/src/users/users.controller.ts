import {
  Controller,
  Body,
  Get,
  Post,
  ConflictException,
  Req,
  Res,
  ParseIntPipe,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { Users } from '../database/entity/users.entity';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  async getAllUser(): Promise<Users[]> {
    return await this.usersService.getAllUsers();
  }

  /**
   * TODO: create new users
   * @param createUserdetails: Created user details
   * @returns: User details
   */
  @Post('signup')
  async createUser(@Body() createUserdetails: CreateUserDto) {
    try {
      // get user details from user service
      const content = await this.usersService.createUser({
        ...createUserdetails,
      });

      if (!content) return 'Error creating user';

      return {
        message: 'User created successfully',
        content,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        return 'Email already exists';
      }
      return 'Error creating user';
    }
  }

  /**
   * TODO: login user
   * @param loginInfos: login information
   * @returns
   */
  @Post('signin')
  async signin(@Body() loginInfos: { email: string; password: string }) {
    const content = await this.usersService.signin(
      loginInfos.email,
      loginInfos.password,
    );
    return content;
  }

  // DO by express way: use Req/Res
  // if use res.sen() --> so cannot use return
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(typeof id);

    const user = await this.usersService.getUserById(id);
    if (user) {
      res.send(user);
    } else {
      res.status(400).send({ message: 'User not found' });
    }
  }

  // Do by Nestjs way: use return
  @Get('search/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUserById(id);
    console.log(user);

    if (user) return user;
    else throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  // get users serialized (without email)
}
