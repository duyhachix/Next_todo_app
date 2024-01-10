// standard libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// internal libraries
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers() {
    const users = await this.usersRepository.find();
    users ? console.log('yes') : console.log('no');
    return users;
  }
}
