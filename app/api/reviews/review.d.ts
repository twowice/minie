// @app/api/reviews/review.d.ts
export interface UserInfo {
  name: string;
  profile_image: string;
}

export interface ProductInfo {
  name: string;
  image: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  product_id: string;
  users: UserInfo;
  products: ProductInfo;
}

export interface ReviewDistribution {
  [key: string]: number; // 1, 2, 3, 4, 5점 분포
}

export interface ReviewsResponse {
  message: string;
  totalCount: number;
  rating: number;
  distribution: ReviewDistribution;
  data: ReviewItem[];
}

export interface ReviewPayload {
  id?: string; // 수정 시에만 존재
  rating: number;
  content: string;
  user_id: string;
  product_id: string;
  image?: File | null; // 이미지 파일
  imageUrl?: string; // 기존 이미지 URL 또는 빈 문자열 (삭제 의미)
}
