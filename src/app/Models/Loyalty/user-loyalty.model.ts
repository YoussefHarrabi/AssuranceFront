import { LoyaltyStatus } from './loyalty-status.model';
import { Challenge } from './challenge.model';
import { Bonus } from './bonus.model';

export class UserLoyalty {
  userId: number;
  fullName: string;
  loyaltyPoints: number;
  loyaltyStatus: LoyaltyStatus;
  completedChallenges: Challenge[];
  redeemedBonuses: Bonus[];

  constructor(data: any = {}) {
    // Extract userId and name from the data (if available)
    this.userId = data.userId || 0;
    this.fullName = data.fullName || '';
    
    // Map 'points' from API to 'loyaltyPoints' in the model
    this.loyaltyPoints = data.points || 0;
    
    // Map 'status' from API to 'loyaltyStatus' in the model
    this.loyaltyStatus = data.status ? new LoyaltyStatus(data.status) : new LoyaltyStatus();
    
    // For completedChallenges and redeemedBonuses, we need to handle both 
    // the case when they're arrays or when they're just counts
    if (Array.isArray(data.completedChallenges)) {
      this.completedChallenges = data.completedChallenges.map((c: any) => new Challenge(c));
    } else {
      this.completedChallenges = [];
    }
    
    if (Array.isArray(data.redeemedBonuses)) {
      this.redeemedBonuses = data.redeemedBonuses.map((b: any) => new Bonus(b));
    } else {
      this.redeemedBonuses = [];
    }
  }
}