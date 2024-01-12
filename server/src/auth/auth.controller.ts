import { Controller, Body, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { SignInDto } from './dtos/SignInDto';

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
      console.log('auth user', authUser);

      return { authUser, message: 'You have been successfully signed in' };
    } catch (err) {}
  }
}
