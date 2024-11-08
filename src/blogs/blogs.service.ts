import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';

import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { promisify } from 'util';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlogsService {
    private readonly writeFileAsync = promisify(fs.writeFile);
    private readonly mkdirAsync = promisify(fs.mkdir);

    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createBlogDto: CreateBlogDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: 1 },
            });
            const blog = new Blog();
            blog.title = createBlogDto.title;
            blog.content = createBlogDto.content;
            blog.user = user;
            blog.image = await this.saveImageToDisk(createBlogDto.image);
            await this.blogRepository.save(blog);
            return {
                message: 'Blog created successfully',
                data: {
                    title: blog.title,
                    image: blog.image,
                },
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Something went wrong, Please try again',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findAll() {
        const blogs = await this.blogRepository
            .createQueryBuilder('blog')
            .innerJoinAndSelect('blog.user', 'user')
            .select([
                'blog.id',
                'blog.title',
                'blog.content',
                'user.id',
                'user.firstname',
                'user.lastname',
            ])
            .getMany();

        return blogs;
    }

    findOne(id: number) {
        return `This action returns a #${id} blog`;
    }

    update(id: number, updateBlogDto: UpdateBlogDto) {
        return `This action updates a #${id} blog`;
    }

    remove(id: number) {
        return `This action removes a #${id} blog`;
    }

    private async ensureUploadDirectoryExists(
        uploadPath: string,
    ): Promise<void> {
        try {
            await fs.promises.access(uploadPath);
        } catch {
            await this.mkdirAsync(uploadPath, { recursive: true });
        }
    }

    async saveImageToDisk(baseImage: any) {
        //หา path จริงของโปรเจค
        const projectPath = process.cwd();
        const uploadPath = path.join(projectPath, 'public', 'images');

        // Ensure upload directory exists
        await this.ensureUploadDirectoryExists(uploadPath);

        //หานามสกุลไฟล์
        const extension = baseImage.substring(
            baseImage.indexOf('/') + 1,
            baseImage.indexOf(';base64'),
        );

        //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
        let ext = '';
        if (extension === 'svg+xml') {
            ext = `svg`;
        } else {
            ext = extension;
        }

        //Extract base64 data ออกมา
        let imgData = this.decodeBase64Image(baseImage);

        const filename = `${uuidv4()}.${ext}`;
        const fullPath = path.join(uploadPath, filename);

        //เขียนไฟล์ไปไว้ที่ path
        await this.writeFileAsync(fullPath, imgData, 'base64');

        //return ชื่อไฟล์ใหม่ออกไป
        return filename;
    }

    decodeBase64Image(base64Str: string) {
        let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }

        return matches[2];
    }
}
