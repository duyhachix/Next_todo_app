import {
  Controller,
  Body,
  HttpStatus,
  Post,
  Req,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signInDto: { email: string; password: string }) {
    try {
      const authUser = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      console.log('authUser', authUser);

      if (!authUser) {
        return { message: 'Email or password is incorrect' };
      }

      return { authUser, message: 'You have been successfully signed in' };
    } catch (err) {
      return err.message;
    }
  }

  @UseGuards(AuthGuard)
  @Get('users')
  async getUsers(@Req() req: any) {
    // get token from headers
    const token = req.headers['authorization'];
    console.log('token', token);

    const users = await this.authService.getUsers(token);

    return users;
  }
}
