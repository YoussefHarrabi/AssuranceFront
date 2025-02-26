import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffer } from '../ModelsCarrieres/job-offer.model';
import { JobOfferService } from '../backoffice-Services/carrieres/job-offer.service';


@Component({
  selector: 'app-job-offer-update',
  templateUrl: './job-offer-update.component.html',
  styleUrls: ['./job-offer-update.component.css']
})
export class JobOfferUpdateComponent implements OnInit {
  jobOffer: JobOffer = new JobOffer();
  id!: number;

  constructor(
    private jobOfferService: JobOfferService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getJobOffer();
  }

  getJobOffer(): void {
    this.jobOfferService.getJobOfferById(this.id).subscribe(
      (offer) => {
        this.jobOffer = offer;
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'offre :', error);
      }
    );
  }

  updateJobOffer(): void {
    this.jobOfferService.updateJobOffer(this.id, this.jobOffer).subscribe(
      () => {
        alert('Offre mise à jour avec succès !');
        this.router.navigate(['/job-offers']); // Redirection vers la liste après mise à jour
      },
      (error) => {
        console.error('Erreur lors de la mise à jour :', error);
      }
    );
  }
}
