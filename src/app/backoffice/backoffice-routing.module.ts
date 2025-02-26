import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { ProfileComponent } from './profile/profile.component';
import { AddJobOfferComponent } from './add-job-offer/add-job-offer.component';
import { JobOfferListComponent } from './job-offer-list/job-offer-list.component';
import { JobOfferUpdateComponent } from './job-offer-update/job-offer-update.component';
const routes: Routes = [
  {
    path: '', component: MainBackofficeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'add-job-offer', component: AddJobOfferComponent },
      { path: 'job-offer-list', component: JobOfferListComponent },
      { path: 'job-offers/update/:id', component: JobOfferUpdateComponent }, // Route pour la mise à jour

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
