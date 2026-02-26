import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponse } from './types/comment-response.type';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  public async createComment(
    userId: string,
    blogId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponse> {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        blogId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.user,
    };
  }

  public async getComments(blogId: string): Promise<CommentResponse[]> {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const comments = await this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.user,
    }));
  }
}
