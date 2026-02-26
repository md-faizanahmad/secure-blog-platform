import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Param, Patch } from '@nestjs/common';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Delete, HttpCode, HttpStatus } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // get Blogs
  @Get('my')
  @UseGuards(JwtAuthGuard)
  public async getMyBlogs(@GetUser() user: JwtPayload): Promise<Blog[]> {
    return this.blogsService.getMyBlogs(user.sub);
  }

  // Blogs Post (Create)
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.createBlog(user.sub, dto);
  }

  // Blogs Update
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.updateBlog(user.sub, id, dto);
  }

  // Blogs Delete
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    await this.blogsService.deleteBlog(user.sub, id);
  }
}
