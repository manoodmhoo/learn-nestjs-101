import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(helmet()); // เพิ่มบรรทัดนี้ เพื่อป้องกันการโจมตีต่างๆ
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe()); // เพิ่มบรรทัดนี้ เพื่อใช้ Auto Validation
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
