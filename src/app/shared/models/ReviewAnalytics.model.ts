export interface ReviewAnalytics {
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    monthlyTrend: any[];
    sentimentDistribution: { [key: string]: number };
  }