import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicBlogResponse } from './types/public-blog-response.type';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  public async getBlogBySlug(slug: string): Promise<PublicBlogResponse> {
    const blog = await this.prisma.blog.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      createdAt: blog.createdAt,
      author: blog.author,
      likeCount: blog._count.likes,
      commentCount: blog._count.comments,
    };
  }
}
