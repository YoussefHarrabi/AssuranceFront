import { Component, OnInit } from '@angular/core';
import { Bonus } from '../../../Models/Loyalty/bonus.model';
import { LoyaltyService } from 'src/app/client/Services/loyalty.service';

@Component({
  selector: 'app-bonus-management',
  templateUrl: './bonus-management.component.html',
  styleUrls: ['./bonus-management.component.css']
})
export class BonusManagementComponent implements OnInit {
  bonuses: Bonus[] = [];
  loading = true;
  error = '';
  showForm = false;
  selectedBonus: Bonus | null = null;

  constructor(private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.loadBonuses();
  }

  loadBonuses(): void {
    this.loading = true;
    this.loyaltyService.getAllBonuses().subscribe({
      next: (data) => {
        this.bonuses = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load bonuses';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.selectedBonus = null;
    this.showForm = true;
  }

  openEditForm(bonus: Bonus): void {
    this.selectedBonus = bonus;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedBonus = null;
  }

  saveBonus(bonus: Bonus): void {
    this.loading = true;
    
    if (bonus.id) {
      // Update existing bonus
      this.loyaltyService.updateBonus(bonus.id, bonus).subscribe({
        next: () => {
          this.loadBonuses();
          this.closeForm();
        },
        error: (err) => {
          this.error = err.message || 'Failed to update bonus';
          this.loading = false;
        }
      });
    } else {
      // Create new bonus
      this.loyaltyService.createBonus(bonus).subscribe({
        next: () => {
          this.loadBonuses();
          this.closeForm();
        },
        error: (err) => {
          this.error = err.message || 'Failed to create bonus';
          this.loading = false;
        }
      });
    }
  }

  deleteBonus(id: number): void {
    if (confirm('Are you sure you want to delete this bonus?')) {
      this.loading = true;
      this.loyaltyService.deleteBonus(id).subscribe({
        next: () => {
          this.loadBonuses();
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete bonus';
          this.loading = false;
        }
      });
    }
  }

  toggleBonusAvailability(bonus: Bonus): void {
    const updatedBonus = {...bonus};
    updatedBonus.isAvailable = !updatedBonus.isAvailable;
    
    this.loyaltyService.updateBonus(bonus.id!, updatedBonus).subscribe({
      next: () => {
        this.loadBonuses();
      },
      error: (err) => {
        this.error = err.message || 'Failed to update bonus availability';
        this.loading = false;
      }
    });
  }
}