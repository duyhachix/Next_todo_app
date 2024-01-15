// standard libraries
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'todo',
      entities: [__dirname + '/**/entity/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
