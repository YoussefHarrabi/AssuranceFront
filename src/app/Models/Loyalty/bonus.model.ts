export class Bonus {
    id?: number;
    name: string;
    description: string;
    pointsRequired: number;
    imageUrl?: string;
    isAvailable: boolean;
    stock: number;
  
    constructor(data: Partial<Bonus> = {}) {
      this.id = data.id;
      this.name = data.name || '';
      this.description = data.description || '';
      this.pointsRequired = data.pointsRequired || 0;
      this.imageUrl = data.imageUrl;
      this.isAvailable = data.isAvailable || false;
      this.stock = data.stock || 0;
    }
  }