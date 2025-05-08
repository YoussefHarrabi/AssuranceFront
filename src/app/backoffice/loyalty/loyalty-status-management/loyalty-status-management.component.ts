import { Component, OnInit } from '@angular/core';
import { LoyaltyStatus } from '../../../Models/Loyalty/loyalty-status.model';
import { LoyaltyService } from 'src/app/client/Services/loyalty.service';

@Component({
  selector: 'app-loyalty-status-management',
  templateUrl: './loyalty-status-management.component.html',
  styleUrls: ['./loyalty-status-management.component.css']
})
export class LoyaltyStatusManagementComponent implements OnInit {
  statuses: LoyaltyStatus[] = [];
  loading = true;
  error = '';
  showForm = false;
  selectedStatus: LoyaltyStatus | null = null;

  constructor(private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    this.loading = true;
    this.loyaltyService.getAllLoyaltyStatuses().subscribe({
      next: (data) => {
        this.statuses = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load loyalty statuses';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.selectedStatus = null;
    this.showForm = true;
  }

  openEditForm(status: LoyaltyStatus): void {
    this.selectedStatus = status;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedStatus = null;
  }

  saveStatus(status: LoyaltyStatus): void {
    this.loading = true;
    
    if (status.id) {
      // Update existing status
      this.loyaltyService.updateLoyaltyStatus(status.id, status).subscribe({
        next: () => {
          this.loadStatuses();
          this.closeForm();
        },
        error: (err) => {
          this.error = err.message || 'Failed to update loyalty status';
          this.loading = false;
        }
      });
    } else {
      // Create new status
      this.loyaltyService.createLoyaltyStatus(status).subscribe({
        next: () => {
          this.loadStatuses();
          this.closeForm();
        },
        error: (err) => {
          this.error = err.message || 'Failed to create loyalty status';
          this.loading = false;
        }
      });
    }
  }

  deleteStatus(id: number): void {
    if (confirm('Are you sure you want to delete this loyalty status?')) {
      this.loading = true;
      this.loyaltyService.deleteLoyaltyStatus(id).subscribe({
        next: () => {
          this.loadStatuses();
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete loyalty status';
          this.loading = false;
        }
      });
    }
  }
}