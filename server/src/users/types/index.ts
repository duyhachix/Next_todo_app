import { Exclude } from '@nestjs/class-transformer';

export interface Users {
  username: string;
  email: string;
  password: string;
}
export class SerializedUser {
  username: string;
  email: string;

  @Exclude()
  password: string;
}
