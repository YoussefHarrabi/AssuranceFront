export class LoyaltyStatus {
    id?: number;
    tier: string;
    pointsThreshold: number;
    description?: string;
    benefits?: string;
  
    constructor(data: Partial<LoyaltyStatus> = {}) {
      this.id = data.id;
      this.tier = data.tier || '';
      this.pointsThreshold = data.pointsThreshold || 0;
      this.description = data.description;
      this.benefits = data.benefits;
    }
  }