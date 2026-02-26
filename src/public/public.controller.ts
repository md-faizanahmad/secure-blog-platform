import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicBlogResponse } from './types/public-blog-response.type';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('blogs/:slug')
  public async getBlogBySlug(
    @Param('slug') slug: string,
  ): Promise<PublicBlogResponse> {
    return this.publicService.getBlogBySlug(slug);
  }
}
