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

  // example how to use token
  async getUsers(token: string) {
    if (!this.isValidToken(token)) {
      throw new Error('Invalid token');
    }
    return await this.usersRepository.find();
  }
  // check if token is valid
  private isValidToken(token: string): boolean {
    // check if token is valid

    // // check token existing
    console.log(token ? 'have token' : 'not have token');
    if (!token) {
      return false;
    }
    // // check token type is valid
    const tokenPart = token.split(' ');
    console.log(
      tokenPart[0] === 'Bearer'
        ? 'Token type is Bearer'
        : 'Token type is not Bearer',
    );
    if (tokenPart.length !== 2 || tokenPart[0] !== 'Bearer') {
      return false;
    }
    // // check token expiration

    return true;
  }

  async validateUser(email: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  public async decodeToken(token: string): Promise<{
    email: string;
    sub: string;
  }> {
    const _token = token.replace('Bearer ', '');
    return this.jwtService.decode(_token);
  }

  public async getUser(email: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    return user;
  }
}
