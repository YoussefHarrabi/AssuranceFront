import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors, Validator } from '@angular/forms';
import { ComplaintService } from '../complaint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Complaint } from '../models/complaint.model';
import { ComplaintType } from '../models/complaint-type.enum';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-edit-reclamation',
  templateUrl: './edit-reclamation.component.html',
  styleUrls: ['./edit-reclamation.component.css']
})
export class EditReclamationComponent implements OnInit, Validator {
  complaint: Complaint = new Complaint();
  complaintTypes = ComplaintType;

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
          
          // Afficher la modal de succès au lieu de l'alerte
          const modalElement = document.getElementById('updateSuccessModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
          
          // Ne pas naviguer immédiatement, la navigation se fera via le bouton de la modal
          // this.router.navigate(['/client/complaintList']);
        },
        (error) => {
          console.error('Error updating complaint', error);
          alert('Une erreur s\'est produite lors de la mise à jour de votre réclamation.');
        }
      );
    }
  }

  navigateToList(): void {
    this.router.navigate(['/client/complaintList']);
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