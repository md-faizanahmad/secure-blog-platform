import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponse } from './types/comment-response.type';
interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('blogs')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponse> {
    return this.commentsService.createComment(user.sub, id, dto);
  }

  @Get(':id/comments')
  public async getComments(
    @Param('id') id: string,
  ): Promise<CommentResponse[]> {
    return this.commentsService.getComments(id);
  }
}
