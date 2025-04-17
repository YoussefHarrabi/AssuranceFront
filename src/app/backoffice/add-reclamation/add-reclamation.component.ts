import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ComplaintService } from '../complaint.service';
import { Router } from '@angular/router';
import { AbstractControl, NgForm, ValidationErrors, Validator } from '@angular/forms';
import { Complaint } from '../models/complaint.model';
import { ComplaintType } from '../models/complaint-type.enum';
import { ComplaintStatus } from '../models/complaint-status.enum';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.css']
})
export class AddReclamationComponent implements Validator {
  @ViewChild('reclamationForm') reclamationForm!: NgForm;
  complaint: Complaint = new Complaint();
  submittedComplaint: Complaint | null = null;
  complaintTypes = ComplaintType;
  complaintStatuses = ComplaintStatus;

  constructor(private complaintService: ComplaintService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.complaint.creationDate = new Date();
      
      // Créer une copie de la réclamation pour l'affichage dans la modal
      this.submittedComplaint = { ...this.complaint };

      this.complaintService.addComplaint(this.complaint).subscribe(response => {
        console.log('Complaint added successfully', response);
        
        // Mise à jour de l'objet submittedComplaint avec la réponse
        if (response && response.id) {
          this.submittedComplaint = response;
        }
        
        // Afficher la modal de succès au lieu de l'alerte
        const modalElement = document.getElementById('successModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
        
        // Ne pas réinitialiser le formulaire ici, cela sera fait via la modal
        // form.reset();
        // Ne pas naviguer immédiatement, cela sera fait via la modal
        // this.router.navigate(['/backoffice/reclamationList']);
      }, error => {
        console.error('Error adding complaint', error);
        alert('Une erreur s\'est produite lors de l\'ajout de votre réclamation.');
      });
    }
  }
  
  // Méthode pour obtenir le libellé du type de réclamation
  getComplaintTypeLabel(typeKey: string | undefined): string {
    if (!typeKey) return '';
    return this.complaintTypes[typeKey as keyof typeof ComplaintType] || typeKey;
  }
  
  // Méthode pour obtenir le libellé du statut de réclamation
  getComplaintStatusLabel(statusKey: string | undefined): string {
    if (!statusKey) return '';
    return this.complaintStatuses[statusKey as keyof typeof ComplaintStatus] || statusKey;
  }

  // Méthode pour naviguer vers la liste des réclamations
  navigateToList(): void {
    this.router.navigate(['/backoffice/complaintList']);
  }
  
  // Méthode pour réinitialiser le formulaire pour ajouter une autre réclamation
  resetForm(): void {
    this.reclamationForm.resetForm();
    this.complaint = new Complaint();
  }

  cancel(): void {
    this.router.navigate(['/backoffice/complaintList']);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null; // Ne rien faire si le champ est vide (la validation "required" s'occupe déjà de ça)
    }

    const isOnlyNumbers = /^[0-9]+$/.test(value); // Vérifie si le titre contient uniquement des chiffres
    const isValid = /[A-Za-z]/.test(value); // Vérifie qu'il contient au moins une lettre

    if (isOnlyNumbers || !isValid) {
      return { invalidTitle: { value: control.value } };
    }

    return null;
  }
}