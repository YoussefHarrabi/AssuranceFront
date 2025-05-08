import { Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/Models/Loyalty/challenge.model';
import { UserLoyalty } from 'src/app/Models/Loyalty/user-loyalty.model';
import { LoyaltyService } from '../../Services/loyalty.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  activeChallenges: Challenge[] = [];
  userLoyalty: UserLoyalty | null = null;
  completedChallengeIds: number[] = []; // Add this to track completed challenge IDs
  loading = true;
  error = '';

  constructor(private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.loadUserLoyaltyInfo();
    this.loadChallenges();
    this.loadCompletedChallenges(); // Add this to load completed challenges
  }

  loadUserLoyaltyInfo(): void {
    this.loyaltyService.getUserLoyaltyInfo().subscribe({
      next: (data) => {
        this.userLoyalty = new UserLoyalty(data);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load user loyalty information';
      }
    });
  }

  loadChallenges(): void {
    this.loading = true;
    this.loyaltyService.getActiveChallenges().subscribe({
      next: (data) => {
        this.activeChallenges = data.map((item: any) => new Challenge(item));
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load challenges';
        this.loading = false;
      }
    });
  }
  
  // Add this method to load completed challenges
  loadCompletedChallenges(): void {
    this.loyaltyService.getUserCompletedChallenges().subscribe({
      next: (data) => {
        if (data && data.completedChallenges && Array.isArray(data.completedChallenges)) {
          // Extract just the IDs from the challenge objects
            this.completedChallengeIds = data.completedChallenges.map((challenge: { id: number }) => challenge.id);
          console.log('Completed challenge IDs:', this.completedChallengeIds);
        }
      },
      error: (err) => {
        console.error('Failed to load completed challenges:', err);
      }
    });
  }

  completeChallenge(challengeId: number): void {
    this.loyaltyService.completeChallenge(challengeId).subscribe({
      next: (response) => {
        // Add the challenge ID to completed challenges immediately
        if (!this.completedChallengeIds.includes(challengeId)) {
          this.completedChallengeIds.push(challengeId);
        }
        this.loadUserLoyaltyInfo(); // Refresh user data
        // Show success notification
      },
      error: (err) => {
        // Show error notification
        console.error('Failed to complete challenge:', err);
      }
    });
  }

  // Update this method to use the completedChallengeIds array
  isChallengeCompleted(challengeId: number): boolean {
    return this.completedChallengeIds.includes(challengeId);
  }
}