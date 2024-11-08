import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
