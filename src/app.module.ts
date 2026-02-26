import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BlogsModule } from './blogs/blogs.module';
import { PublicModule } from './public/public.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    BlogsModule,
    PublicModule,
  ],
})
export class AppModule {}
