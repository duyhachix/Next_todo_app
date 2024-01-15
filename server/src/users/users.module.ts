// standard libraries
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
// internal libraries
import { UsersService } from './users.service';
import { Users } from '../database/entity/users.entity';
import { UsersController } from './users.controller';
import { ValidateUserMiddleware } from '../users/midllewares/validate-user.middleware';
// import { ValidateUserAccount } from './midllewares/validate-user-account.middleware'; // for the test purpose
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from 'src/config/jwt_config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule.forRoot(),
    JwtModule.register(jwtConfig),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [TypeOrmModule, UsersService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply middleware for routes that listed below
    consumer
      .apply(
        ValidateUserMiddleware,
        // ValidateUserAccount,
      )
      .exclude(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/update', method: RequestMethod.PUT },
        {
          path: 'users/:id',
          method: RequestMethod.GET,
        },
        {
          path: 'users/search/:id',
          method: RequestMethod.GET,
        },
      ) // exclude "/user" route out of the middleware
      .forRoutes(UsersController);
  }
}
