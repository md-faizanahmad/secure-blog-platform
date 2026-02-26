import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicBlogResponse } from './types/public-blog-response.type';
import { Query } from '@nestjs/common';
import { PublicFeedResponse } from './types/public-feed-response.type';
import { FeedQueryDto } from './dto/feed-query.dto';
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  // get blogs by slug
  @Get('blogs/:slug')
  public async getBlogBySlug(
    @Param('slug') slug: string,
  ): Promise<PublicBlogResponse> {
    return this.publicService.getBlogBySlug(slug);
  }

  // public feed with pagination rate limit
  @Get('feed')
  public async getFeed(
    @Query() query: FeedQueryDto,
  ): Promise<PublicFeedResponse> {
    return this.publicService.getFeed(query.page, query.limit);
  }
}
