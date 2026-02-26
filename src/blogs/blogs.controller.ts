import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Blog } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';

interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.createBlog(user.sub, dto);
  }
}
