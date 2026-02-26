import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicBlogResponse } from './types/public-blog-response.type';
import { PublicFeedResponse } from './types/public-feed-response.type';
@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  // get blogs by titleslug
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

  // public feed with pagination rate limit
  public async getFeed(
    page: number,
    limit: number,
  ): Promise<PublicFeedResponse> {
    const safePage: number = page > 0 ? page : 1;
    const safeLimit: number = limit > 0 && limit <= 50 ? limit : 10;

    const skip: number = (safePage - 1) * safeLimit;

    const [total, blogs] = await this.prisma.$transaction([
      this.prisma.blog.count({
        where: { isPublished: true },
      }),
      this.prisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
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
      }),
    ]);

    return {
      page: safePage,
      limit: safeLimit,
      total,
      items: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        createdAt: blog.createdAt,
        author: blog.author,
        likeCount: blog._count.likes,
        commentCount: blog._count.comments,
      })),
    };
  }
}
