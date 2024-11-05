import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  getBlogs(): string {
    return 'This action returns all blogs';
  }
}
