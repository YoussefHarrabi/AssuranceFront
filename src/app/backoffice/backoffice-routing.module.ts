import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { ProfileComponent } from './profile/profile.component';
import { InsuranceProTypeComponent } from './InsuranceProType/insurance-pro-type/insurance-pro-type.component';
import { InsuranceProTypeFormComponent } from './InsuranceProType/insurance-pro-type-form/insurance-pro-type-form.component';
import { InsuranceProStatisticsComponent } from './insurance-pro-statistics/insurance-pro-statistics.component';

const routes: Routes = [
  {
    path: '', component: MainBackofficeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'insurance-pro-type', component: InsuranceProTypeComponent },
      { path: 'insurance-pro-type/add', component: InsuranceProTypeFormComponent },
      { path: 'insurance-pro-type/add/:id', component: InsuranceProTypeFormComponent },
      { path: 'insurance-pro/statistics', component: InsuranceProStatisticsComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
