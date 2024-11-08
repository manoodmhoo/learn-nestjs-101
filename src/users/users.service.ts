import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  // Inject Repository into the service
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
        const user = new User();
        user.firstname = createUserDto.firstname;
        user.lastname = createUserDto.lastname;
        user.email = createUserDto.email;
        user.password = await argon2.hash(createUserDto.password);
        return await this.usersRepository.save(user);
    } catch (error) {
       if(error.errno === 1062) {
         throw new HttpException('Email already exists', HttpStatus.CONFLICT);
       }
       throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ order: { "id": "DESC" } });
  }

  async findAllWithPagination(page: number = 1, page_size: number = 10): Promise<User[]> {
    return  await this.usersRepository.find({ 
      skip: (page - 1) * page_size,
      take: page_size,
      order: { "id": "DESC" } 
    });
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { "id": id } });
      if(!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    try {
      const user =  await this.findOne(id);
      if(!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      const user =  await this.findOne(id);
      if(!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const result = await this.usersRepository.delete(id);
      if(result.affected === 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Something went wrong, Please try again', HttpStatus.BAD_REQUEST);
    }
  }
}
