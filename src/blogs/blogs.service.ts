import { ConflictException, Injectable } from '@nestjs/common';
import { Blog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { generateSlug } from './utils/slug.util';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
