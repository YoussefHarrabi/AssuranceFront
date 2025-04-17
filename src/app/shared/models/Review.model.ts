import { ReviewStatus } from "./ReviewStatus.enum";
export interface Review {
    id: number;
    rating: number;
    comment: string;
    categories: string[];
    createdAt: string;
    helpfulVotes: number;
    isPublic: boolean;
    companyResponse?: string;
  }