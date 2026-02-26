export interface PublicFeedItem {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  author: {
    id: string;
    email: string;
  };
  likeCount: number;
  commentCount: number;
}

export interface PublicFeedResponse {
  page: number;
  limit: number;
  total: number;
  items: PublicFeedItem[];
}
