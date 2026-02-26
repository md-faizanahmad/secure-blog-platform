export interface PublicBlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    email: string;
  };
  likeCount: number;
  commentCount: number;
}
