import { Component, OnInit } from '@angular/core';
import { Complaint } from 'src/app/client/models/complaint.model';
import { ComplaintService } from '../complaint.service';
import { Router } from '@angular/router';
import { ComplaintStatus } from '../models/complaint-status.enum';
import * as bootstrap from 'bootstrap';
import { ComplaintType } from '../models/complaint-type.enum';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  selectedComplaint: Complaint | null = null;
  showStatsDropdown: boolean = false;
  // Filtres
  selectedType: string = '';
  statusSearchText: string = '';
  
  // Enums et options
  complaintTypes = Object.values(ComplaintType);
  complaintStatuses = Object.values(ComplaintStatus);
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;
  
  // Informations utilisateur
  currentUser: string = 'Hosinusss';
  currentDateTime: Date = new Date('2025-04-16T19:59:21');
  
  // Modals
  deleteModal: any;
  deleteSuccessModal: any;

  constructor(private complaintService: ComplaintService, private router: Router) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getComplaints().subscribe(data => {
      this.complaints = data;
      this.filteredComplaints = data;
    });
  }

  filterByStatus(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.complaints];
    
    // Filtre par type
    if (this.selectedType) {
      filtered = filtered.filter(complaint => 
        complaint.type === this.selectedType
      );
    }

    // Filtre par status
    if (this.statusSearchText) {
      const searchText = this.statusSearchText.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.status.toLowerCase().includes(searchText)
      );
    }

    this.filteredComplaints = filtered;
  }

  clearStatusFilter(): void {
    this.statusSearchText = '';
    this.applyFilters();
  }

  clearTypeFilter(): void {
    this.selectedType = '';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedType = '';
    this.statusSearchText = '';
    this.filteredComplaints = [...this.complaints];
  }

  openDeleteConfirmModal(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
      this.deleteModal.show();
    }
  }

  confirmDelete(): void {
    if (this.selectedComplaint) {
      this.currentDateTime = new Date('2025-04-16T19:59:21');
      
      this.complaintService.deleteComplaint(this.selectedComplaint.id).subscribe(
        () => {
          if (this.deleteModal) {
            this.deleteModal.hide();
          }
          
          this.complaints = this.complaints.filter(
            complaint => complaint.id !== this.selectedComplaint?.id
          );
          this.applyFilters();
          
          const successModalElement = document.getElementById('deleteSuccessModal');
          if (successModalElement) {
            this.deleteSuccessModal = new bootstrap.Modal(successModalElement);
            this.deleteSuccessModal.show();
          }
        },
        error => {
          console.error('Error deleting complaint', error);
          alert('Une erreur s\'est produite lors de la suppression de la réclamation.');
        }
      );
    }
  }

  editComplaint(id: number): void {
    this.router.navigate(['/backoffice/editComplaint', id]);
  }

  addComplaint(): void {
    this.router.navigate(['/backoffice/addComplaint']);
  }

  handleComplaint(id: number): void {
    this.router.navigate(['/backoffice/reclamations/response', id]);
  }

  openModal(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.updateComplaintStatusToInProgress(complaint);
    const complaintModal = new bootstrap.Modal(
      document.getElementById('complaintModal')!
    );
    complaintModal.show();
  }

  private updateComplaintStatusToInProgress(complaint: Complaint): void {
    if (complaint.status !== ComplaintStatus.IN_PROGRESS) {
      complaint.status = ComplaintStatus.IN_PROGRESS;

      this.complaintService.updateComplaint(complaint).subscribe(
        updatedComplaint => {
          console.log('Statut de la réclamation mis à jour à IN_PROGRESS.');
          this.selectedComplaint = updatedComplaint;
          
          const index = this.complaints.findIndex(c => c.id === updatedComplaint.id);
          if (index !== -1) {
            this.complaints[index] = updatedComplaint;
            this.applyFilters();
          }
        },
        error => {
          console.error('Erreur lors de la mise à jour de la réclamation', error);
        }
      );
    }
  }

  navigateToStatistics(type: 'type' | 'status' | 'histogram'): void {
    this.showStatsDropdown = false; // Ferme le dropdown
    const fragment = type === 'histogram' ? 'histogram' : 
                    type === 'status' ? 'status' : 'type';
    this.router.navigate(['/backoffice/admin/statistics'], { fragment: fragment });
  }

  getStatusClass(status: ComplaintStatus | undefined): string {
    switch (status) {
      case ComplaintStatus.PENDING:
        return 'status-pending';
      case ComplaintStatus.IN_PROGRESS:
        return 'status-in-progress';
      case ComplaintStatus.RESOLVED:
        return 'status-resolved';
      default:
        return '';
    }
  }
}