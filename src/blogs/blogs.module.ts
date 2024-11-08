import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog } from './entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Blog, User])],
    controllers: [BlogsController],
    providers: [BlogsService],
})
export class BlogsModule {}
