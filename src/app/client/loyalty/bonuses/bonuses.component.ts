import { Component, OnInit } from '@angular/core';
import { Bonus } from 'src/app/Models/Loyalty/bonus.model';
import { UserLoyalty } from 'src/app/Models/Loyalty/user-loyalty.model';
import { LoyaltyService } from '../../Services/loyalty.service';

@Component({
  selector: 'app-bonuses',
  templateUrl: './bonuses.component.html',
  styleUrls: ['./bonuses.component.css']
})
export class BonusesComponent implements OnInit {
  availableBonuses: Bonus[] = [];
  userLoyalty: UserLoyalty | null = null;
  redeemedBonusIds: number[] = [];
  loading = true;
  error = '';
  
  constructor(private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.loadUserLoyaltyInfo();
    this.loadRedeemedBonuses();
    this.loadBonuses();
  }

  loadUserLoyaltyInfo(): void {
    this.loyaltyService.getUserLoyaltyInfo().subscribe({
      next: (data) => {
        console.log('User loyalty data:', data);
        this.userLoyalty = new UserLoyalty(data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load user loyalty information';
      }
    });
  }

  loadRedeemedBonuses(): void {
    this.loyaltyService.getUserRedeemedBonusIds().subscribe({
      next: (ids) => {
        this.redeemedBonusIds = ids;
      },
      error: (err) => {
        console.error('Failed to load redeemed bonuses:', err);
      }
    });
  }

  loadBonuses(): void {
    this.loading = true;
    this.loyaltyService.getAvailableBonuses().subscribe({
      next: (data) => {
        this.availableBonuses = data.map((item: any) => new Bonus(item));
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load bonuses';
        this.loading = false;
      }
    });
  }

  redeemBonus(bonusId: number): void {
    this.loyaltyService.redeemBonus(bonusId).subscribe({
      next: (response) => {
        // Add the redeemed bonus ID to our local array
        if (!this.redeemedBonusIds.includes(bonusId)) {
          this.redeemedBonusIds.push(bonusId);
        }
        
        // Update local point count if response contains updated points
        if (response && response.points && this.userLoyalty) {
          this.userLoyalty.loyaltyPoints = response.points;
        } else {
          // If no updated points in response, refresh user data
          this.loadUserLoyaltyInfo();
        }
        
        // Show success notification
        alert('Bonus redeemed successfully!');
      },
      error: (err) => {
        console.error('Failed to redeem bonus:', err);
        alert('Failed to redeem bonus: ' + (err.message || 'Unknown error'));
      }
    });
  }

  canRedeem(bonus: Bonus): boolean {
    if (!this.userLoyalty) {
      return false;
    }
    
    return this.userLoyalty.loyaltyPoints >= bonus.pointsRequired;
  }

  isBonusRedeemed(bonusId: number): boolean {
    return this.redeemedBonusIds.includes(bonusId);
  }
}