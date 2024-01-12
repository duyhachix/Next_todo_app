// standard libraries
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// internal libraries
import { Users } from '../database/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    try {
      // retrieve the user that matching the email
      const user = await this.usersRepository.findOne({
        where: { email: email },
        select: {
          username: true,
          email: true,
          password: true,
        },
      });
      if (!user) {
        throw new BadRequestException('Email or password is incorrect');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Email or password is incorrect');
      }
      // create access_token
      const payload = {
        email: user.email,
        sub: user.id,
      };
      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      delete user.password;
      return { ...user, access_token: access_token };
    } catch (error) {
      return error.message;
    }
  }
}
