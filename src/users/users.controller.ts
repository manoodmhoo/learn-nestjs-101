import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  HttpStatus, 
  BadRequestException, 
  HttpException } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Object> {
      try {
        const user = await this.usersService.create(createUserDto);
        return {
          status: HttpStatus.CREATED,
          message: 'User created successfully',
          data: {
            id: user.id,
            fullname: `${user.firstname} ${user.lastname}`,
            email: user.email,
            role: user.role
          }
        }
      } catch (error) {
        if(error.errno === 1062) {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
        throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
      }
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('paginate')
  async findAllWithPagination(@Query() query: any) {
    const page = query.page || 1;
    const page_size = query.page_size || 10;
    return await this.usersService.findAllWithPagination(+page, +page_size);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) : Promise<Object> {
    try {
      const result = await this.usersService.update(+id, updateUserDto);
      if(result.affected === 1) {
        return {
          status: HttpStatus.OK,
          message: 'User updated successfully'
        }
      } 
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Object> {
     try {
        const result = await this.usersService.remove(+id);
        if(result.affected === 1) {
          return {
            status: HttpStatus.OK,
            message: 'User deleted successfully'
          }
        }
     } catch (error) {
        if (error.status === 404) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
     }
  }
}

