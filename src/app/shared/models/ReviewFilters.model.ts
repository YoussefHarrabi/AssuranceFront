import { ReviewStatus } from "./ReviewStatus.enum";

export interface ReviewFilters {
    status?: ReviewStatus;
    category?: string[];
    rating?: number;
    sentiment?: string;
    dateFrom?: Date;
    dateTo?: Date;
    hasCompanyResponse?: boolean;
  }