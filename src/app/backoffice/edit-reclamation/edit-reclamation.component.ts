import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors, Validator } from '@angular/forms';
import { ComplaintService } from '../complaint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Complaint } from '../models/complaint.model';
import { ComplaintType } from '../models/complaint-type.enum';
import { ComplaintStatus } from '../models/complaint-status.enum';

@Component({
  selector: 'app-edit-reclamation',
  templateUrl: './edit-reclamation.component.html',
  styleUrls: ['./edit-reclamation.component.css']
})
export class EditReclamationComponent  implements OnInit, Validator {
  complaint: Complaint = new Complaint();
  complaintTypes = ComplaintType;
  complaintStatuses = ComplaintStatus;

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
          alert('Votre réclamation a été mise à jour avec succès.');
          this.router.navigate(['/backoffice/complaintList']);
        },
        (error) => {
          console.error('Error updating complaint', error);
          alert('Une erreur s\'est produite lors de la mise à jour de votre réclamation.');
        }
      );
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

    const isOnlyNumbers = /^[0-9]+$/.test(value); // Vérifie s'il contient uniquement des chiffres
    const isValid = /[A-Za-z]/.test(value); // Vérifie qu'il contient au moins une lettre

    if (isOnlyNumbers || !isValid) {
      return { invalidTitle: { value: control.value } };
    }

    return null;
  }
}