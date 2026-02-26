export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    email: string;
  };
}
