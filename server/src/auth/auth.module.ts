// standard library
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// internal library
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Users } from '../database/entity/users.entity';
import { TokenMiddleware } from 'src/users/midllewares/token.middleware';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConfig } from 'src/config/jwt_config';
// import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('auth');
  }
}
