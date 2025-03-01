import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { BackofficeNavbarComponent } from './backoffice-navbar/backoffice-navbar.component';
import { BackofficeSidebarComponent } from './backoffice-sidebar/backoffice-sidebar.component';
import { BackofficeFooterComponent } from './backoffice-footer/backoffice-footer.component';
import { ProfileComponent } from './profile/profile.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';

import { EditReclamationComponent } from './edit-reclamation/edit-reclamation.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplaintResponseComponent } from './complaint-response/complaint-response.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MainBackofficeComponent,
    BackofficeNavbarComponent,
    BackofficeSidebarComponent,
    BackofficeFooterComponent,
    ProfileComponent,
    ReclamationComponent,
    ReclamationListComponent,
    AddReclamationComponent,
    EditReclamationComponent,
    ComplaintResponseComponent,
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    RouterModule,
    FormsModule

  ]
})
export class BackofficeModule { }
