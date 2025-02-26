import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';

import { JobOfferListFrontComponent } from './job-offer-list-front/job-offer-list-front.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { HttpClientModule } from '@angular/common/http';    

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { JobOfferDetailsComponent } from './job-offer-details/job-offer-details.component';
import { UploadCvComponent } from './upload-cv/upload-cv.component';
@NgModule({
  declarations: [
    HomeComponent,
    MainClientComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    
    JobOfferListFrontComponent,
    JobApplicationComponent,
    JobOfferDetailsComponent,
    UploadCvComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClientRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    
    MatButtonModule
  ]
})
export class ClientModule { }
