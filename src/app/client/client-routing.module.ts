import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { JobOfferListFrontComponent } from './job-offer-list-front/job-offer-list-front.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { JobOfferDetailsComponent } from './job-offer-details/job-offer-details.component';

const routes: Routes = [
  {
    path: '', component: MainClientComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'job-offer-list-front', component: JobOfferListFrontComponent },
      { path: 'job-application', component: JobApplicationComponent },
      { path: 'job-offer-details/:id',component: JobOfferDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
