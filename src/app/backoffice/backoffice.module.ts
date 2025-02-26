import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { BackofficeNavbarComponent } from './backoffice-navbar/backoffice-navbar.component';
import { BackofficeSidebarComponent } from './backoffice-sidebar/backoffice-sidebar.component';
import { BackofficeFooterComponent } from './backoffice-footer/backoffice-footer.component';
import { ProfileComponent } from './profile/profile.component';
import { AddJobOfferComponent } from './add-job-offer/add-job-offer.component';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { HttpClientModule } from '@angular/common/http';
import { JobOfferListComponent } from './job-offer-list/job-offer-list.component';
import { JobOfferUpdateComponent } from './job-offer-update/job-offer-update.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MainBackofficeComponent,
    BackofficeNavbarComponent,
    BackofficeSidebarComponent,
    BackofficeFooterComponent,
    ProfileComponent,
    AddJobOfferComponent,
    JobOfferListComponent,
    JobOfferUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    BackofficeRoutingModule,
    HttpClientModule
  ]
})
export class BackofficeModule { }
