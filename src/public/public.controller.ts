import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicBlogResponse } from './types/public-blog-response.type';
import { Query } from '@nestjs/common';
import { PublicFeedResponse } from './types/public-feed-response.type';
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
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PublicFeedResponse> {
    return this.publicService.getFeed(page, limit);
  }
}
