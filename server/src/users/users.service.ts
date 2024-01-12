// standard libraries
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';

// internal libraries
import { Users } from '../database/entity/users.entity';
import { CreateUserParams } from '../utils/types';

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

  /**
   * TODO: create new users
   * @param newUserDetails : User details
   * @returns : User details
   */
  async createUser(newUserDetails: CreateUserParams) {
    // check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: newUserDetails.email },
    } as FindOneOptions<Users>);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = this.usersRepository.create({
      ...newUserDetails,
    });
    // encrypt the user password
    const salt = await bcrypt.genSalt();
    const hassPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hassPassword;

    return await this.usersRepository.save(newUser);
  }

  /**
   * TODO: login user
   * @param email : login email
   * @param password : login password
   * @returns logged in user info
   */
  async signin(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
        select: { email: true, password: true, username: true },
      });

      if (!user) {
        throw new BadRequestException('Email or password is incorrect');
      }
      // compare hash password vs plain password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        throw new BadRequestException('Email or password is incorrect');
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
