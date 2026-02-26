import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  public async likeBlog(
    userId: string,
    blogId: string,
  ): Promise<{ likeCount: number }> {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    try {
      await this.prisma.like.create({
        data: {
          userId,
          blogId,
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        throw new ConflictException('You have already liked this blog');
      }

      throw error;
    }

    const likeCount: number = await this.prisma.like.count({
      where: { blogId },
    });

    return { likeCount };
  }

  public async unlikeBlog(
    userId: string,
    blogId: string,
  ): Promise<{ likeCount: number }> {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    if (!existingLike) {
      throw new NotFoundException('You have not liked this blog');
    }

    await this.prisma.like.delete({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    const likeCount: number = await this.prisma.like.count({
      where: { blogId },
    });

    return { likeCount };
  }
}
