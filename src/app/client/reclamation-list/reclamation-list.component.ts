import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../complaint.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { Complaint } from '../models/complaint.model';
import { ComplaintStatus } from '../models/complaint-status.enum';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  complaints: Complaint[] = [];
  selectedComplaint: Complaint | null = null;
  modalInstance: any; // Pour gérer la boîte de dialogue
  deleteModal: any; // Pour la modal de confirmation de suppression
  deleteSuccessModal: any; // Pour la modal de succès de suppression

  public ComplaintStatus = ComplaintStatus;

  constructor(private complaintService: ComplaintService, private router: Router) {}

  ngOnInit() {
    this.complaintService.getComplaints().subscribe(complaints => {
      this.complaints = complaints;
    });
  }

  openModal(complaint: Complaint) {
    console.log('Réclamation sélectionnée :', complaint); // Vérifier les données

    this.selectedComplaint = complaint;

    if (this.selectedComplaint.status === ComplaintStatus.PENDING) {
      this.selectedComplaint.status = ComplaintStatus.IN_PROGRESS;
      this.updateComplaintStatus(this.selectedComplaint.id, ComplaintStatus.IN_PROGRESS);
    }

    let modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    console.log('Statut actuel :', this.selectedComplaint.status); // Vérifier le statut
  }

  // Méthode pour mettre à jour le statut dans la base de données
  updateComplaintStatus(id: number, newStatus: ComplaintStatus) {
    this.complaintService.updateStatus(id, newStatus).subscribe(() => {
      console.log(`Statut mis à jour en ${newStatus}`);
    });
  }

  editComplaint(id: number): void {
    this.router.navigate(['/client/editComplaint', id]);
  }

  // Nouvelle méthode pour ouvrir la modal de confirmation de suppression
  openDeleteConfirmModal(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
      this.deleteModal.show();
    }
  }

  // Méthode pour confirmer la suppression
  confirmDelete(): void {
    if (this.selectedComplaint) {
      this.complaintService.deleteComplaint(this.selectedComplaint.id).subscribe(
        () => {
          // Fermer la modal de confirmation
          if (this.deleteModal) {
            this.deleteModal.hide();
          }
          
          // Mise à jour de la liste des réclamations
          this.complaints = this.complaints.filter(complaint => complaint.id !== this.selectedComplaint?.id);
          
          // Afficher la modal de succès
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

  // Méthode de suppression d'origine (remplacée par openDeleteConfirmModal)
  deleteComplaint(id: number): void {
    // Cette méthode est maintenant remplacée par openDeleteConfirmModal et confirmDelete
    // Gardée pour référence
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintService.deleteComplaint(id).subscribe(() => {
        this.complaints = this.complaints.filter(complaint => complaint.id !== id);
        alert('Complaint deleted successfully');
      }, error => {
        console.error('Error deleting complaint', error);
        alert('An error occurred while deleting the complaint');
      });
    }
  }

  addComplaint(): void {
    this.router.navigate(['/client/addReclamation']);
  }

  triggerShake(event: Event) {
    const button = event.target as HTMLElement;
    button.classList.add("shake");

    // Supprimer l'effet après l'animation pour qu'il puisse être rejoué
    setTimeout(() => {
      button.classList.remove("shake");
    }, 500);
  }

  playErrorSoundAndShowModal(event: Event, complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.triggerShake(event);
  
    // Charger et jouer le son d'erreur
    let audio = new Audio();
    audio.src = 'assets/client/sound-of-error-beep-hd-267280.mp3';
    audio.load(); // S'assure que le son est chargé avant de le jouer
    audio.play().catch(error => console.error("Erreur de lecture du son :", error)); 
  
    // Afficher la boîte de dialogue
    let modalElement = document.getElementById('noResponseModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}