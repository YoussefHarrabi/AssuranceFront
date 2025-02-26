import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { JobApplicationServiceService } from '../job-application-service.service';
import { JobApplication } from 'src/app/backoffice/ModelsCarrieres/job-application.model';


@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.component.html',
  styleUrls: ['./upload-cv.component.css']
})
export class UploadCvComponent {
  jobOffer: any = null; // Remplissez avec l'offre d'emploi réelle
  cv: string = ''; // Le chemin du CV
  lettreMotivationPath: string | null = null; // Le chemin de la lettre de motivation
  email: string = ''; // L'email de l'utilisateur

  constructor(
    private jobApplicationService: JobApplicationServiceService,
    public dialogRef: MatDialogRef<UploadCvComponent>
  ) {}

  onSubmit() {
    // Crée un objet de candidature
    const jobApplication: JobApplication = {
      id:0,
      jobOffer: this.jobOffer || null,
      statut: 'NOUVELLE',
      dateCandidature: new Date(), // Date actuelle
      cvPath: this.cv, // Le chemin du fichier CV
      lettreMotivationPath: '',
      email: this.email, // L'email de la personne qui postule
    };

    // Envoie la candidature via le service
    this.jobApplicationService.addJobApplication(jobApplication).subscribe(
      (response) => {
        console.log('Candidature envoyée avec succès', response);
        alert('Votre candidature a été envoyée avec succès !');
      },
      (error) => {
        console.error('Erreur lors de l\'envoi de la candidature', error);
        alert('Une erreur est survenue lors de l\'envoi de votre candidature.');
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  }
