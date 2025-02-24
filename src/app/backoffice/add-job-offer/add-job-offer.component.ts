import { Component } from '@angular/core';
import { JobOfferService } from '../backoffice-Services/carrieres/job-offer.service';
import { JobOffer } from '../ModelsCarrieres/job-offer.model';


@Component({
  selector: 'app-add-job-offer',
  templateUrl: './add-job-offer.component.html',
  styleUrls: ['./add-job-offer.component.css']
})
export class AddJobOfferComponent {
  jobOffer: JobOffer = {
    id: 0,
    titre: '',
    description: '',
    datePublication: '',
    dateExpiration: '',
    lieu: '',
    typeContrat: '',
    salaire: '',
    competencesRequises: '',
    experienceMinimale: 0,
    statut: 'ACTIVE'
  };

  constructor(private jobOfferService: JobOfferService) { }
  onSubmit() {
    const jobOfferToSend = { ...this.jobOffer } as any; // Override strict typing
    delete jobOfferToSend.id; // Now this works
  
    console.log('Job Offer Sent:', jobOfferToSend);
  
    this.jobOfferService.addJobOffer(jobOfferToSend).subscribe(
      response => {
        console.log('Offre d\'emploi créée:', response);
        // Réinitialiser le formulaire
        this.jobOffer = {
          id: 0, // Keep in Angular but don't send it
          titre: '',
          description: '',
          datePublication: '',
          dateExpiration: '',
          lieu: '',
          typeContrat: '',
          salaire: '',
          competencesRequises: '',
          experienceMinimale: 0,
          statut: 'ACTIVE'
        };
      },
      error => {
        console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
      }
    );
  }
  
}  