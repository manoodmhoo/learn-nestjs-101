import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'mysql',
    port: 3306,
    username: 'nestjs_user',
    password: 'password',
    database: 'nestjs_db',
    entities: [User],
    synchronize: true, // comment this out in production
  }),
  BlogsModule, UsersModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
