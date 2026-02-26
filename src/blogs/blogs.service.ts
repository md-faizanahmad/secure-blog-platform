import { ConflictException, Injectable } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { generateSlug } from './utils/slug.util';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateBlogDto } from './dto/update-blog.dto';
@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  //   CreateBlog
  public async createBlog(userId: string, dto: CreateBlogDto): Promise<Blog> {
    const baseSlug: string = generateSlug(dto.title);

    try {
      return await this.prisma.blog.create({
        data: {
          title: dto.title,
          content: dto.content,
          isPublished: dto.isPublished,
          slug: baseSlug,
          userId,
        },
      });
    } catch (error: unknown) {
      // Unique slug violation
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        throw new ConflictException(
          'Slug already exists. Use different title.',
        );
      }

      throw error;
    }
  }

  // Update Blog
  public async updateBlog(
    userId: string,
    blogId: string,
    dto: UpdateBlogDto,
  ): Promise<Blog> {
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    if (existingBlog.userId !== userId) {
      throw new ForbiddenException('You do not own this blog');
    }

    let updatedSlug: string | undefined;

    if (dto.title) {
      updatedSlug = generateSlug(dto.title);
    }

    try {
      return await this.prisma.blog.update({
        where: { id: blogId },
        data: {
          title: dto.title,
          content: dto.content,
          isPublished: dto.isPublished,
          ...(updatedSlug && { slug: updatedSlug }),
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        throw new ConflictException(
          'Slug already exists. Use different title.',
        );
      }

      throw error;
    }
  }

  // Delete Blog
  public async deleteBlog(userId: string, blogId: string): Promise<void> {
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    if (existingBlog.userId !== userId) {
      throw new ForbiddenException('You do not own this blog');
    }

    await this.prisma.blog.delete({
      where: { id: blogId },
    });
  }
}
