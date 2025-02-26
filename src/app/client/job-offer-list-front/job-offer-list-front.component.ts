import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobOfferService } from 'src/app/backoffice/backoffice-Services/carrieres/job-offer.service';
import { JobOffer } from 'src/app/backoffice/ModelsCarrieres/job-offer.model';
import { MatDialog } from '@angular/material/dialog';
import { JobApplicationComponent } from '../job-application/job-application.component';
import { UploadCvComponent } from '../upload-cv/upload-cv.component';
@Component({
  selector: 'app-job-offer-list-front',
  templateUrl: './job-offer-list-front.component.html',
  styleUrls: ['./job-offer-list-front.component.css']
})
export class JobOfferListFrontComponent implements OnInit {
 
    jobOffers: JobOffer[] = [];
   
    constructor(private jobOfferService: JobOfferService , public router: Router,  public dialog: MatDialog)  {}
  
    ngOnInit() {
      this.jobOfferService.getJobOffers().subscribe(
        (data: JobOffer[]) => {
          this.jobOffers = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des offres', error);
        }
      );
      
    }
    applyForJob(jobOffer: JobOffer): void {
      const dialogRef = this.dialog.open(JobApplicationComponent, {
        width: '400px',
        data: { jobOffer }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    viewDetails(id: number): void {
      this.router.navigate(['/client/job-offer-details', id]);
    }

    openUploadCvDialog(): void {
      const dialogRef = this.dialog.open(UploadCvComponent, {
        width: '400px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }

