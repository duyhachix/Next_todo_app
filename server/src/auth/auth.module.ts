// standard library
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
// internal library
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { UsersService } from 'src/users/users.service';
import { Users } from '../database/entity/users.entity';
import { TokenMiddleware } from 'src/users/midllewares/token.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [TypeOrmModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('auth');
  }
}
