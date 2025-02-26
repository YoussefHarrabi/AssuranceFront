import { Component, OnInit } from '@angular/core';
import { JobOfferService } from '../backoffice-Services/carrieres/job-offer.service';
import { JobOffer } from '../ModelsCarrieres/job-offer.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-job-offer-list',
  templateUrl: './job-offer-list.component.html',
  styleUrls: ['./job-offer-list.component.css']
})
export class JobOfferListComponent implements OnInit {
  jobOffers: JobOffer[] = [];

  constructor(private jobOfferService: JobOfferService,private router: Router) {}
  ngOnInit(): void {
    this.jobOfferService.getJobOffers().subscribe(
      (data: JobOffer[]) => {
        this.jobOffers = data;
        console.log(this.jobOffers)
      },
      (error) => {
        console.error('Erreur lors de la récupération des offres', error);
      }
    );
  }
  updateOffer(id: number): void {
    this.router.navigate(['/backoffice/job-offers/update', id]);
  }
  
  deleteOffer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.jobOfferService.deleteJobOffer(id).subscribe(
        () => {
          this.jobOffers = this.jobOffers.filter(offer => offer.id !== id);
          console.log('Offre supprimée avec succès.');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'offre :', error);
        }
      );
    }
  }
  }


