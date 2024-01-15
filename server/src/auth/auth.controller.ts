// standard
import {
  Controller,
  Body,
  HttpStatus,
  Post,
  Req,
  Request,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
// internal libraries
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() signInDto: { email: string; password: string },
    @Request() req: Request,
  ) {
    console.log('req', req.headers);

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

  @UseGuards(AuthenticationGuard)
  @Get('users')
  async getUsers(@Req() req: any) {
    // get token from headers
    const token = req.headers['authorization'];
    console.log('getUsers`s token', token);

    const users = await this.authService.getUsers(token);
    console.log('users', users);

    return users;
  }
}
