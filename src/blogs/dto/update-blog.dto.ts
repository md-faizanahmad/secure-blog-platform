import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  public readonly title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  public readonly content?: string;

  @IsOptional()
  @IsBoolean()
  public readonly isPublished?: boolean;
}
