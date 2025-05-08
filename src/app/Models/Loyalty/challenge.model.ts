export class Challenge {
    id?: number;
    name: string;
    description: string;
    pointsAwarded: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
  
    constructor(data: Partial<Challenge> = {}) {
      this.id = data.id;
      this.name = data.name || '';
      this.description = data.description || '';
      this.pointsAwarded = data.pointsAwarded || 0;
      this.startDate = data.startDate || new Date();
      this.endDate = data.endDate;
      this.isActive = data.isActive || false;
    }
  }