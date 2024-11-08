import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async login(LoginDto: LoginDto) {
        // #1 find user by email
        const user = await this.userRepository.findOne({
            where: { email: LoginDto.email },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // #2 compare password
        const isPasswordMatch = await argon2.verify(
            user.password,
            LoginDto.password,
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        // #3 Create JWT token
        const token = await this.jwtService.signAsync(
            {
                user_id: user.id,
                email: user.email,
                role: user.role,
            },
            { secret: process.env.JWT_SECRET },
        );

        return {
            access_token: token,
        };
    }

    async getProfile(user: any) {
        const userProfile = await this.userRepository.findOne({
            where: { id: user.userId },
        });

        if (!userProfile) {
            throw new NotFoundException('User not found');
        }

        return {
            id: userProfile.id,
            fullname: `${userProfile.firstname} ${userProfile.lastname}`,
            email: userProfile.email,
            role: userProfile.role,
        };
    }
}
