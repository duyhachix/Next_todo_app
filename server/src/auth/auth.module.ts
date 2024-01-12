// standard library
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// internal library
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { UsersService } from 'src/users/users.service';
import { Users } from '../database/entity/users.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
