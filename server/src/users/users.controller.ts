import { Controller, Body, Get, Post, ConflictException } from '@nestjs/common';
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
}
