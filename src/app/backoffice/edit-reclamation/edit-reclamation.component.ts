import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors, Validator } from '@angular/forms';
import { ComplaintService } from '../complaint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Complaint } from '../models/complaint.model';
import { ComplaintType } from '../models/complaint-type.enum';
import { ComplaintStatus } from '../models/complaint-status.enum';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-edit-reclamation',
  templateUrl: './edit-reclamation.component.html',
  styleUrls: ['./edit-reclamation.component.css']
})
export class EditReclamationComponent implements OnInit, Validator {
  complaint: Complaint = new Complaint();
  complaintTypes = ComplaintType;
  complaintStatuses = ComplaintStatus;
  originalComplaint: Complaint = new Complaint(); // Pour stocker l'état initial

  constructor(
    private complaintService: ComplaintService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.complaintService.getComplaintById(+id).subscribe(
        (data) => {
          this.complaint = data;
          // Copie profonde pour conserver l'état initial
          this.originalComplaint = JSON.parse(JSON.stringify(data));
        },
        (error) => {
          console.error('Error fetching complaint', error);
        }
      );
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.complaintService.updateComplaint(this.complaint).subscribe(
        (response) => {
          console.log('Complaint updated successfully', response);
          
          // Mettre à jour l'objet complaint avec la réponse si nécessaire
          if (response) {
            this.complaint = response;
          }
          
          // Afficher la modal de succès au lieu de l'alerte
          const modalElement = document.getElementById('updateSuccessModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
          
          // Ne pas naviguer immédiatement, cela sera fait via la modal
          // this.router.navigate(['/backoffice/complaintList']);
        },
        (error) => {
          console.error('Error updating complaint', error);
          alert('Une erreur s\'est produite lors de la mise à jour de votre réclamation.');
        }
      );
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
  
  // Méthode pour obtenir la date actuelle (pour la date de modification)
  getCurrentDate(): Date {
    return new Date();
  }

  // Méthode pour naviguer vers la liste des réclamations
  navigateToList(): void {
    this.router.navigate(['/backoffice/complaintList']);
  }

  // Obtenir les modifications apportées
  getChanges(): { [key: string]: { previous: any, current: any } } {
    const changes: { [key: string]: { previous: any, current: any } } = {};
    
    for (const key in this.complaint) {
      if (this.complaint.hasOwnProperty(key) && this.originalComplaint.hasOwnProperty(key)) {
        if (JSON.stringify(this.complaint[key as keyof Complaint]) !== 
            JSON.stringify(this.originalComplaint[key as keyof Complaint])) {
          changes[key] = {
            previous: this.originalComplaint[key as keyof Complaint],
            current: this.complaint[key as keyof Complaint]
          };
        }
      }
    }
    
    return changes;
  }

  cancel(): void {
    this.router.navigate(['/backoffice/complaintList']);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null; // Ne rien faire si le champ est vide (la validation "required" s'occupe déjà de ça)
    }

    const isOnlyNumbers = /^[0-9]+$/.test(value); // Vérifie s'il contient uniquement des chiffres
    const isValid = /[A-Za-z]/.test(value); // Vérifie qu'il contient au moins une lettre

    if (isOnlyNumbers || !isValid) {
      return { invalidTitle: { value: control.value } };
    }

    return null;
  }
}