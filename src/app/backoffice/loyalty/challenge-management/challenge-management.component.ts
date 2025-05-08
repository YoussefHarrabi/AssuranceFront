import { Component, OnInit } from '@angular/core';
import { Challenge } from '../../../Models/Loyalty/challenge.model';
import { LoyaltyService } from 'src/app/client/Services/loyalty.service';

@Component({
  selector: 'app-challenge-management',
  templateUrl: './challenge-management.component.html',
  styleUrls: ['./challenge-management.component.css']
})
export class ChallengeManagementComponent implements OnInit {
  challenges: Challenge[] = [];
  loading = true;
  error = '';
  showForm = false;
  selectedChallenge: Challenge | null = null;

  constructor(private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.loading = true;
    this.loyaltyService.getAllChallenges().subscribe({
      next: (data) => {
        this.challenges = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load challenges';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.selectedChallenge = null;
    this.showForm = true;
  }

  openEditForm(challenge: Challenge): void {
    this.selectedChallenge = challenge;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedChallenge = null;
  }

  saveChallenge(challenge: Challenge): void {
    this.loading = true;
    
    if (challenge.id) {
      // Update existing challenge
      this.loyaltyService.updateChallenge(challenge.id, challenge).subscribe({
        next: () => {
          this.loadChallenges();
          this.closeForm();
        },
        error: (err) => {
          this.error = err.message || 'Failed to update challenge';
          this.loading = false;
        }
      });
    } else {
      // Create new challenge
      this.loyaltyService.createChallenge(challenge).subscribe({
        next: () => {
          this.loadChallenges();
          this.closeForm();
        },
        error: (err) => {
          this.error = err.message || 'Failed to create challenge';
          this.loading = false;
        }
      });
    }
  }

  deleteChallenge(id: number): void {
    if (confirm('Are you sure you want to delete this challenge?')) {
      this.loading = true;
      this.loyaltyService.deleteChallenge(id).subscribe({
        next: () => {
          this.loadChallenges();
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete challenge';
          this.loading = false;
        }
      });
    }
  }

  toggleChallengeStatus(challenge: Challenge): void {
    const updatedChallenge = {...challenge};
    updatedChallenge.isActive = !updatedChallenge.isActive;
    
    this.loyaltyService.updateChallenge(challenge.id!, updatedChallenge).subscribe({
      next: () => {
        this.loadChallenges();
      },
      error: (err) => {
        this.error = err.message || 'Failed to update challenge status';
        this.loading = false;
      }
    });
  }
}