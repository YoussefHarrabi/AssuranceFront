import { Component, ViewChild } from '@angular/core';
import { JobOfferService } from '../backoffice-Services/carrieres/job-offer.service';
import { JobOffer } from '../ModelsCarrieres/job-offer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-job-offer',
  templateUrl: './add-job-offer.component.html',
  styleUrls: ['./add-job-offer.component.css']
})
export class AddJobOfferComponent {
  @ViewChild('jobOfferForm') jobOfferForm: any;
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
    statut: 'ACTIVE',
    nbrVacant:0
  };

  statutOptions = ['ACTIVE', 'EXPIRE']; // Correspond au backend

  constructor(private jobOfferService: JobOfferService, private router: Router) { }

  onSubmit() {
    if (this.jobOfferForm.invalid) {
      console.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }
    const jobOfferToSend = { ...this.jobOffer } as any;
    delete jobOfferToSend.id; // Supprime l'ID pour éviter les conflits

    console.log('Job Offer Sent:', jobOfferToSend);

    this.jobOfferService.addJobOffer(jobOfferToSend).subscribe(
      response => {
        console.log('Offre d\'emploi créée:', response);
        // Réinitialisation du formulaire
        this.jobOffer = {
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
          statut: 'ACTIVE',
          nbrVacant: 0
        };
      },
      error => {
        console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
      }
    );
  }

  viewJobOffers() {
    this.router.navigate(['backoffice/job-offer-list']);
  }
}
