import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobOfferService } from 'src/app/backoffice/backoffice-Services/carrieres/job-offer.service';
import { JobOffer } from 'src/app/backoffice/ModelsCarrieres/job-offer.model';

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
  styleUrls: ['./job-offer-details.component.css']
})
export class JobOfferDetailsComponent implements OnInit {
  jobOffer!: JobOffer;

  constructor(
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobOfferService.getJobOfferById(+id).subscribe(
        (data: JobOffer) => {
          this.jobOffer = data;
        }
  
      );
    }
  }
}
