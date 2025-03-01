import { Component, EventEmitter, Output } from '@angular/core';
import { ComplaintService } from '../complaint.service';
import { Router } from '@angular/router';
import { AbstractControl, NgForm, ValidationErrors, Validator } from '@angular/forms';
import { Complaint } from '../models/complaint.model';
import { ComplaintType } from '../models/complaint-type.enum';
import { ComplaintStatus } from '../models/complaint-status.enum';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.css']
})
export class AddReclamationComponent  implements Validator {
  complaint: Complaint = new Complaint();
  complaintTypes = ComplaintType;
  complaintStatuses = ComplaintStatus;

  constructor(private complaintService: ComplaintService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.complaint.creationDate = new Date();

      this.complaintService.addComplaint(this.complaint).subscribe(response => {
        console.log('Complaint added successfully', response);
        alert('Votre réclamation a été ajoutée avec succès.');
        form.reset();
        this.router.navigate(['/backoffice/reclamationList']);
      }, error => {
        console.error('Error adding complaint', error);
        alert('Une erreur s\'est produite lors de l\'ajout de votre réclamation.');
      });
    }
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