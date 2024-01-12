// standard libraries
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// internal libraries
import { UsersService } from './users.service';
import { Users } from '../database/entity/users.entity';
import { UsersController } from './users.controller';
import { ValidateUserMiddleware } from '../users/midllewares/validate-user.middleware';
// import { ValidateUserAccount } from './midllewares/validate-user-account.middleware'; // for the test purpose

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
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
      .exclude({ path: 'users', method: RequestMethod.GET }) // exclude "/user" route out of the middleware
      .forRoutes(UsersController);
  }
}
