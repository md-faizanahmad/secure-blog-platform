import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  public readonly title!: string;

  @IsString()
  @MinLength(10)
  public readonly content!: string;

  @IsBoolean()
  public readonly isPublished!: boolean;
}
