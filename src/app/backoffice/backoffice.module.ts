import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { BackofficeNavbarComponent } from './backoffice-navbar/backoffice-navbar.component';
import { BackofficeSidebarComponent } from './backoffice-sidebar/backoffice-sidebar.component';
import { BackofficeFooterComponent } from './backoffice-footer/backoffice-footer.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListTypeAssuranceComponent } from './list-type-assurance/list-type-assurance.component';
import { EditTypeAssuranceComponent } from './edit-type-assurance/edit-type-assurance.component';
import { TypeAssuranceStatisticsComponent } from './type-assurance-statistics/type-assurance-statistics.component';
import { ListAssuranceComponent } from './list-assurance/list-assurance.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    DashboardComponent,
    MainBackofficeComponent,
    BackofficeNavbarComponent,
    BackofficeSidebarComponent,
    BackofficeFooterComponent,
    ProfileComponent,
    ListTypeAssuranceComponent,
    EditTypeAssuranceComponent,
    TypeAssuranceStatisticsComponent,
     ListAssuranceComponent,
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    HttpClientModule,
    ReactiveFormsModule ,
    FormsModule,
     NgxPaginationModule,
  ]
})
export class BackofficeModule { }
