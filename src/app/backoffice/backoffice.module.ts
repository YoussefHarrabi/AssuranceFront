import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { BackofficeNavbarComponent } from './backoffice-navbar/backoffice-navbar.component';
import { BackofficeSidebarComponent } from './backoffice-sidebar/backoffice-sidebar.component';
import { BackofficeFooterComponent } from './backoffice-footer/backoffice-footer.component';
import { ProfileComponent } from './profile/profile.component';
import { InsuranceProTypeComponent } from './InsuranceProType/insurance-pro-type/insurance-pro-type.component';
import { InsuranceProTypeFormComponent } from './InsuranceProType/insurance-pro-type-form/insurance-pro-type-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsuranceProStatisticsComponent } from './insurance-pro-statistics/insurance-pro-statistics.component';
import { NgChartsModule } from 'ng2-charts';

const routes: Routes = [
  { path: 'insuranceprotype', component: InsuranceProTypeComponent },
  // ...other backoffice routes...
];

@NgModule({
  declarations: [
    DashboardComponent,
    MainBackofficeComponent,
    BackofficeNavbarComponent,
    BackofficeSidebarComponent,
    BackofficeFooterComponent,
    ProfileComponent,
    InsuranceProTypeComponent,
    InsuranceProTypeFormComponent,
    InsuranceProStatisticsComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
    
  ]
})
export class BackofficeModule { }
