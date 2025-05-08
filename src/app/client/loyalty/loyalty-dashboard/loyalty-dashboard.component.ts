import { Component, OnInit } from '@angular/core';

import { Challenge } from 'src/app/Models/Loyalty/challenge.model';
import { Bonus } from 'src/app/Models/Loyalty/bonus.model';
import { LoyaltyService } from '../../Services/loyalty.service';

@Component({
  selector: 'app-loyalty-dashboard',
  templateUrl: './loyalty-dashboard.component.html',
  styleUrls: ['./loyalty-dashboard.component.css']
})
export class LoyaltyDashboardComponent implements OnInit {
  userLoyalty: any = null;
  availableChallenges: Challenge[] = [];
  availableBonuses: Bonus[] = [];
  completedChallengeIds: number[] = [];
  redeemedBonusIds: number[] = []; // Track redeemed bonus IDs
  loading = true;
  error = '';
  // Pagination properties
challengesPerPage: number = 3;
bonusesPerPage: number = 3;
historyItemsPerPage: number = 5;
currentChallengePage: number = 1;
currentBonusPage: number = 1;
completedChallengePage: number = 1;
redeemedBonusPage: number = 1;

  constructor(private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.loadUserLoyaltyInfo();
    this.loadActiveChallenges();
    this.loadAvailableBonuses();
  }

  loadUserLoyaltyInfo(): void {
    this.loading = true;
    this.loyaltyService.getUserLoyaltyInfo().subscribe({
      next: (data) => {
        // Create a normalized user loyalty object from the backend response
        this.userLoyalty = {
          // Map the fields directly from the response
          loyaltyPoints: data.points || 0,
          loyaltyStatus: data.status || {},
          completedChallenges: data.completedChallenges || 0,
          redeemedBonuses: data.redeemedBonuses || 0,
          availableStatuses: data.availableStatuses || []
        };
        
        console.log('Loaded user loyalty info:', this.userLoyalty);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load loyalty information';
        console.error('Error loading loyalty info:', err);
        this.loading = false;
      }
    });
  }

  loadActiveChallenges(): void {
    this.loyaltyService.getActiveChallenges().subscribe({
      next: (data) => {
        this.availableChallenges = data.map((item: any) => new Challenge(item));
        // After loading challenges, check which ones are completed
        this.checkCompletedChallenges();
      },
      error: (err) => {
        console.error('Failed to load challenges:', err);
      }
    });
  }

  loadAvailableBonuses(): void {
    this.loyaltyService.getAvailableBonuses().subscribe({
      next: (data) => {
        this.availableBonuses = data.map((item: any) => new Bonus(item));
        // After loading bonuses, check which ones are redeemed
        this.checkRedeemedBonuses();
      },
      error: (err) => {
        console.error('Failed to load bonuses:', err);
      }
    });
  }

  // Check which challenges are completed
// Modify the checkCompletedChallenges method to better handle the response
checkCompletedChallenges(): void {
  this.loyaltyService.getUserCompletedChallengeIds().subscribe({
    next: (data) => {
      // Make sure data is an array of numbers
      this.completedChallengeIds = Array.isArray(data) ? data : [];
      console.log('Completed challenge IDs:', this.completedChallengeIds);
    },
    error: (err) => {
      console.error('Failed to load completed challenge IDs:', err);
      // Initialize as empty array on error
      this.completedChallengeIds = [];
    }
  });
}

  // Check which bonuses are redeemed
  checkRedeemedBonuses(): void {
    this.loyaltyService.getUserRedeemedBonuses().subscribe({
      next: (data) => {
        if (data && data.redeemedBonuses && Array.isArray(data.redeemedBonuses)) {
          // Extract just the IDs from the bonus objects
            this.redeemedBonusIds = data.redeemedBonuses.map((bonus: { id: number }) => bonus.id);
          console.log('Redeemed bonus IDs:', this.redeemedBonusIds);
        } else {
          this.redeemedBonusIds = [];
        }
      },
      error: (err) => {
        console.error('Failed to load redeemed bonus IDs:', err);
        this.redeemedBonusIds = [];
      }
    });
  }
  // Method to calculate the user's progress in the loyalty program (for the tier progression bar)
getProgramProgress(): number {
  if (!this.userLoyalty || !this.userLoyalty.availableStatuses) {
    return 0;
  }
  
  const currentPoints = this.userLoyalty.loyaltyPoints || 0;
  
  // If there are no available statuses, use a default max value
  if (!Array.isArray(this.userLoyalty.availableStatuses) || this.userLoyalty.availableStatuses.length === 0) {
    // Default max threshold of 1000 points
    return Math.min((currentPoints / 1000) * 100, 100);
  }
  
  // Sort statuses by points threshold
  const sortedStatuses = [...this.userLoyalty.availableStatuses].sort(
    (a: any, b: any) => a.pointsThreshold - b.pointsThreshold
  );
  
  // Get the highest tier's threshold
  const maxThreshold = sortedStatuses.length > 0 ? 
    sortedStatuses[sortedStatuses.length - 1].pointsThreshold : 1000;
  
  // Calculate percentage (capped at 100%)
  return Math.min((currentPoints / maxThreshold) * 100, 100);
}

// Method to parse benefits list from a string to an array
getBenefitsList(): string[] {
  if (!this.userLoyalty || !this.userLoyalty.loyaltyStatus || !this.userLoyalty.loyaltyStatus.benefits) {
    return [];
  }
  
  // Split benefits by commas or newlines
  const benefitsText = this.userLoyalty.loyaltyStatus.benefits;
  if (typeof benefitsText !== 'string') {
    return [];
  }
  
  return benefitsText.split(/[,\n]/).map(benefit => benefit.trim()).filter(benefit => benefit.length > 0);
}
// Add these methods to your LoyaltyDashboardComponent class

// Get the point threshold required for a specific tier
getTierThreshold(tierName: string): number | null {
  if (!this.userLoyalty || !this.userLoyalty.availableStatuses || !Array.isArray(this.userLoyalty.availableStatuses)) {
    return null;
  }
  
  const status = this.userLoyalty.availableStatuses.find((s: any) => s.tier === tierName);
  return status ? status.pointsThreshold : null;
}

// Get sorted statuses to display markers on the progress bar
getSortedStatuses(): any[] {
  if (!this.userLoyalty || !this.userLoyalty.availableStatuses || !Array.isArray(this.userLoyalty.availableStatuses)) {
    return [];
  }
  
  return [...this.userLoyalty.availableStatuses].sort((a: any, b: any) => a.pointsThreshold - b.pointsThreshold);
}

// Calculate position for marker on the progress bar
getMarkerPosition(points: number): number {
  if (!this.userLoyalty || !this.userLoyalty.availableStatuses) {
    return 0;
  }
  
  // Get maximum points threshold
  const sortedStatuses = this.getSortedStatuses();
  const maxThreshold = sortedStatuses.length > 0 ? 
    sortedStatuses[sortedStatuses.length - 1].pointsThreshold : 1000;
    
  // Calculate percentage position
  return (points / maxThreshold) * 100;
}

  completeChallenge(challengeId: number): void {
    this.loyaltyService.completeChallenge(challengeId).subscribe({
      next: (response) => {
        // Update points directly in our local object
        if (response && response.totalPoints) {
          this.userLoyalty.loyaltyPoints = response.totalPoints;
        }
        
        // Add this challenge to completed challenges immediately
        if (!this.completedChallengeIds.includes(challengeId)) {
          this.completedChallengeIds.push(challengeId);
          console.log('Updated completed challenges:', this.completedChallengeIds);
        }
        
        this.loadUserLoyaltyInfo(); // Also refresh all user data
      },
      error: (err) => {
        this.error = err.message || 'Failed to complete challenge';
        console.error('Failed to complete challenge:', err);
      }
    });
  }

  redeemBonus(bonusId: number): void {
    this.loyaltyService.redeemBonus(bonusId).subscribe({
      next: (response) => {
        // Update points directly in our local object
        if (response && response.remainingPoints) {
          this.userLoyalty.loyaltyPoints = response.remainingPoints;
        }
        
        // Add this bonus to redeemed bonuses
        if (!this.redeemedBonusIds.includes(bonusId)) {
          this.redeemedBonusIds.push(bonusId);
        }
        
        this.loadUserLoyaltyInfo(); // Also refresh all user data
        this.loadAvailableBonuses(); // Refresh bonuses
      },
      error: (err) => {
        this.error = err.message || 'Failed to redeem bonus';
        console.error('Failed to redeem bonus:', err);
      }
    });
  }

  // Helper methods to get full challenge/bonus objects by ID
  getChallengeById(id: number): Challenge | undefined {
    return this.availableChallenges.find(challenge => challenge.id === id);
  }

  getBonusById(id: number): Bonus | undefined {
    return this.availableBonuses.find(bonus => bonus.id === id);
  }

  // Check if a challenge is completed
 // Also, add debugging to your isChallengeCompleted method
isChallengeCompleted(challengeId: number): boolean {
  const isCompleted = this.completedChallengeIds.includes(challengeId);
  console.log(`Challenge ${challengeId} completed: ${isCompleted}`);
  return isCompleted;
}
  // Check if a bonus is redeemed
  isBonusRedeemed(bonusId: number): boolean {
    return this.redeemedBonusIds.includes(bonusId);
  }

  getNextTier(): any {
    if (!this.userLoyalty || !this.userLoyalty.availableStatuses) {
      return null;
    }
    
    // Find the user's current tier
    const currentTier = this.userLoyalty.loyaltyStatus?.tier || 'SILVER';
    const currentPoints = this.userLoyalty.loyaltyPoints || 0;
    
    // Find the next tier the user hasn't achieved yet
    const availableTiers = this.userLoyalty.availableStatuses.filter(
      (status: any) => status.pointsThreshold > currentPoints
    );
    
    if (availableTiers.length === 0) {
      return null; // User has highest tier
    }
    
    // Get the next tier with lowest threshold above user's points
    const nextTier = availableTiers.reduce(
      (prev: any, curr: any) => (prev.pointsThreshold < curr.pointsThreshold) ? prev : curr
    );
    
    return {
      tier: nextTier.tier,
      pointsThreshold: nextTier.pointsThreshold,
      pointsNeeded: nextTier.pointsThreshold - currentPoints
    };
  }
  // Challenge pagination methods
getPaginatedChallenges(): Challenge[] {
  const startIndex = (this.currentChallengePage - 1) * this.challengesPerPage;
  const endIndex = Math.min(startIndex + this.challengesPerPage, this.availableChallenges.length);
  return this.availableChallenges.slice(startIndex, endIndex);
}

getTotalChallengePages(): number {
  return Math.ceil(this.availableChallenges.length / this.challengesPerPage);
}

getChallengePageNumbers(): number[] {
  const totalPages = this.getTotalChallengePages();
  let pages: number[] = [];
  
  // Show at most 5 page numbers
  if (totalPages <= 5) {
    // If less than 5 pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // If more than 5 pages, show current, 2 before and 2 after if possible
    const start = Math.max(1, this.currentChallengePage - 2);
    const end = Math.min(totalPages, start + 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
}

prevChallengePage(): void {
  if (this.currentChallengePage > 1) {
    this.currentChallengePage--;
  }
}

nextChallengePage(): void {
  if (this.currentChallengePage < this.getTotalChallengePages()) {
    this.currentChallengePage++;
  }
}

goToChallengePage(page: number): void {
  if (page >= 1 && page <= this.getTotalChallengePages()) {
    this.currentChallengePage = page;
  }
}

// Bonus pagination methods
getPaginatedBonuses(): Bonus[] {
  const startIndex = (this.currentBonusPage - 1) * this.bonusesPerPage;
  const endIndex = Math.min(startIndex + this.bonusesPerPage, this.availableBonuses.length);
  return this.availableBonuses.slice(startIndex, endIndex);
}

getTotalBonusPages(): number {
  return Math.ceil(this.availableBonuses.length / this.bonusesPerPage);
}

getBonusPageNumbers(): number[] {
  const totalPages = this.getTotalBonusPages();
  let pages: number[] = [];
  
  // Show at most 5 page numbers
  if (totalPages <= 5) {
    // If less than 5 pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // If more than 5 pages, show current, 2 before and 2 after if possible
    const start = Math.max(1, this.currentBonusPage - 2);
    const end = Math.min(totalPages, start + 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
}

prevBonusPage(): void {
  if (this.currentBonusPage > 1) {
    this.currentBonusPage--;
  }
}

nextBonusPage(): void {
  if (this.currentBonusPage < this.getTotalBonusPages()) {
    this.currentBonusPage++;
  }
}

goToBonusPage(page: number): void {
  if (page >= 1 && page <= this.getTotalBonusPages()) {
    this.currentBonusPage = page;
  }
}

// Completed Challenges pagination methods
getPaginatedCompletedChallenges(): number[] {
  const startIndex = (this.completedChallengePage - 1) * this.historyItemsPerPage;
  const endIndex = Math.min(startIndex + this.historyItemsPerPage, this.completedChallengeIds.length);
  return this.completedChallengeIds.slice(startIndex, endIndex);
}

getTotalCompletedChallengePages(): number {
  return Math.ceil(this.completedChallengeIds.length / this.historyItemsPerPage);
}

getCompletedChallengesStartIndex(): number {
  return (this.completedChallengePage - 1) * this.historyItemsPerPage;
}

getCompletedChallengesEndIndex(): number {
  return Math.min(
    this.getCompletedChallengesStartIndex() + this.historyItemsPerPage, 
    this.completedChallengeIds.length
  );
}

prevCompletedChallengePage(): void {
  if (this.completedChallengePage > 1) {
    this.completedChallengePage--;
  }
}

nextCompletedChallengePage(): void {
  if (this.completedChallengePage < this.getTotalCompletedChallengePages()) {
    this.completedChallengePage++;
  }
}

// Redeemed Bonuses pagination methods
getPaginatedRedeemedBonuses(): number[] {
  const startIndex = (this.redeemedBonusPage - 1) * this.historyItemsPerPage;
  const endIndex = Math.min(startIndex + this.historyItemsPerPage, this.redeemedBonusIds.length);
  return this.redeemedBonusIds.slice(startIndex, endIndex);
}

getTotalRedeemedBonusPages(): number {
  return Math.ceil(this.redeemedBonusIds.length / this.historyItemsPerPage);
}

getRedeemedBonusesStartIndex(): number {
  return (this.redeemedBonusPage - 1) * this.historyItemsPerPage;
}

getRedeemedBonusesEndIndex(): number {
  return Math.min(
    this.getRedeemedBonusesStartIndex() + this.historyItemsPerPage, 
    this.redeemedBonusIds.length
  );
}

prevRedeemedBonusPage(): void {
  if (this.redeemedBonusPage > 1) {
    this.redeemedBonusPage--;
  }
}

nextRedeemedBonusPage(): void {
  if (this.redeemedBonusPage < this.getTotalRedeemedBonusPages()) {
    this.redeemedBonusPage++;
  }
}
}