import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { JobOffer } from 'src/app/backoffice/ModelsCarrieres/job-offer.model';
import { JobApplicationServiceService } from '../job-application-service.service';
import { JobApplication } from 'src/app/backoffice/ModelsCarrieres/job-application.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent implements OnInit {
  jobApplicationForm!: FormGroup;
  jobOffer!: JobOffer;

  constructor(
    private fb: FormBuilder,
    private jobApplicationService: JobApplicationServiceService,
    public dialogRef: MatDialogRef<JobApplicationComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.jobOffer = data.jobOffer;
  }

  ngOnInit(): void {
    this.jobApplicationForm = this.fb.group({
      cv: [null, Validators.required],
      lettreMotivation: [null, Validators.required]
    });
  }
  onFileChange(event: any, field: string): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64String = reader.result as string;
        this.jobApplicationForm.patchValue({ [field]: base64String });
      };
  
      reader.readAsDataURL(file); // Convertit en Base64
    }
  }
  

  onSubmit(): void {
    if (this.jobApplicationForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('userId', '1'); // Remplacez par l'ID utilisateur réel
    formData.append('jobOfferId', this.jobOffer.id.toString());
    formData.append('cv', this.jobApplicationForm.get('cv')?.value);
    formData.append('lettreMotivation', this.jobApplicationForm.get('lettreMotivation')?.value);

    this.jobApplicationService.addJobApplication(formData).subscribe(
      () => {
        alert('Candidature envoyée avec succès');
        this.dialogRef.close();
      },
      (error) => {
        alert('Erreur lors de l\'envoi de la candidature');
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

 
}