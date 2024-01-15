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
  UseGuards,
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { Users } from '../database/entity/users.entity';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { AuthenticationGuard } from 'src/auth/guard/authentication.guard';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

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
   * Get user info by token
   * @param req: Request object
   * @returns User information
   */
  @UseGuards(AuthenticationGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getUsetByToken(@Req() req: Request) {
    const token = req.headers['authorization'];
    console.log('getUsers`s token', token);
    const userJWT = await this.authService.decodeToken(token);
    console.log('--------', userJWT);

    return req['user'];
  }

  @UseGuards(AuthenticationGuard)
  @Put('update')
  @ApiBearerAuth()
  async updateUser(@Req() req: Request, @Body() UpdateUserDto: UpdateUserDto) {
    const token = req.headers['authorization'];
    const userJWT = await this.authService.decodeToken(token);

    const old_user = await this.usersService.getUserByEmail(userJWT.email);

    const updateInfo = {
      ...old_user,
      ...UpdateUserDto,
    };

    const response = await this.usersService.updateUser(
      old_user.email,
      updateInfo,
    );

    return {
      message: 'Update user successfully',
      response,
    };
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
}
