import { Component } from '@angular/core';
import { NgForm, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { ComplaintService } from '../complaint.service';
import { ComplaintType } from '../models/complaint-type.enum';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Complaint } from '../models/complaint.model';
import { ComplaintStatus } from '../models/complaint-status.enum';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.css'],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AddReclamationComponent,
      multi: true
    }
  ]
})
export class AddReclamationComponent implements Validator {
  complaint: Complaint = new Complaint();
  complaintTypes = ComplaintType;
  selectedComplaint: Complaint | null = null;


  constructor(private complaintService: ComplaintService,  private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.complaint.status = ComplaintStatus.PENDING;
      this.complaint.creationDate = new Date();

      this.complaintService.addComplaint(this.complaint).subscribe(response => {
        console.log('Complaint added successfully', response);
        alert('Votre réclamation a été ajoutée avec succès.');
        form.reset();
      }, error => {
        console.error('Error adding complaint', error);
        alert('Une erreur s\'est produite lors de l\'ajout de votre réclamation.');
      });
    }
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

  openModal(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  editComplaint(id: number): void {
    this.router.navigate(['/client/editComplaint', id]);
  }
 
}
