import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { LikesService } from './likes.service';

interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('blogs')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  public async like(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ likeCount: number }> {
    return this.likesService.likeBlog(user.sub, id);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async unlike(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ likeCount: number }> {
    return this.likesService.unlikeBlog(user.sub, id);
  }
}
