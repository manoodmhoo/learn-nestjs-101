import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt-auth.guard';

// #1 ถ้าวาง @UseGuards(JwtAuthGuard) ไว้ที่นี่ จะทำให้ทุกเมธอดในคลาสนี้ต้องมีการยืนยันตัวตนก่อนเข้าถึง
// @UseGuards(JwtAuthGuard)
@Controller({
    version: '1',
    path: 'blogs',
})
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    // #2 ถ้าวาง @UseGuards(JwtAuthGuard) ไว้ที่นี่ จะทำให้เมธอดนี้ต้องมีการยืนยันตัวตนก่อนเข้าถึง
    @UseGuards(AdminJwtAuthGuard)
    @Post()
    create(@Body() createBlogDto: CreateBlogDto, @Request() req: any) {
        return this.blogsService.create(createBlogDto, req.user);
    }

    @Get()
    findAll() {
        return this.blogsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.blogsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(+id, updateBlogDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogsService.remove(+id);
    }
}
