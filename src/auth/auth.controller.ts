import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Request,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() LoginDto: LoginDto) {
        return await this.authService.login(LoginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Request() req: any) {
        return await this.authService.getProfile(req.user);
    }
}
