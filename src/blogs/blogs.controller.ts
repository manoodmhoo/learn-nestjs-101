import { Controller, Get } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller({
  path: 'blogs',
  version: '1',
})
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(): string {
    return this.blogsService.getBlogs();
  }
}
