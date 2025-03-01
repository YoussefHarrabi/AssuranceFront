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
  selectedType: string = '';
  complaintTypes = Object.values(ComplaintType);

  constructor(private complaintService: ComplaintService, private router: Router) {}

  ngOnInit(): void {
    this.complaintService.getComplaints().subscribe(data => {
      this.complaints = data;
      this.filteredComplaints = data;
    });
  }

  deleteComplaint(id: number): void {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintService.deleteComplaint(id).subscribe(() => {
        this.complaints = this.complaints.filter(complaint => complaint.id !== id);
        this.filterComplaints();
        alert('Complaint deleted successfully');
      }, error => {
        console.error('Error deleting complaint', error);
        alert('An error occurred while deleting the complaint');
      });
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
    const complaintModal = new bootstrap.Modal(document.getElementById('complaintModal')!);
    complaintModal.show();
  }

  private updateComplaintStatusToInProgress(complaint: Complaint): void {
    if (complaint.status !== ComplaintStatus.IN_PROGRESS) {
      complaint.status = ComplaintStatus.IN_PROGRESS; // Mettre à jour le statut à IN_PROGRESS

      this.complaintService.updateComplaint(complaint).subscribe(
        updatedComplaint => {
          console.log('Statut de la réclamation mis à jour à IN_PROGRESS.');
          this.selectedComplaint = updatedComplaint; // Mettre à jour la réclamation sélectionnée avec les données mises à jour
        },
        error => {
          console.error('Erreur lors de la mise à jour de la réclamation', error);
        }
      );
    }
  }

  filterComplaints(): void {
    if (this.selectedType) {
      this.filteredComplaints = this.complaints.filter(complaint => complaint.type === this.selectedType);
    } else {
      this.filteredComplaints = this.complaints;
    }
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