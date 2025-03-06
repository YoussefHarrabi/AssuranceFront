import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { BackofficeNavbarComponent } from './backoffice-navbar/backoffice-navbar.component';
import { BackofficeSidebarComponent } from './backoffice-sidebar/backoffice-sidebar.component';
import { BackofficeFooterComponent } from './backoffice-footer/backoffice-footer.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ShowComponent } from './GestionUsers/show/show.component';
import { AddUsersComponent } from './GestionUsers/add-users/add-users.component';
import { UpdateUsersComponent } from './GestionUsers/update-users/update-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { BackofficeUnauthorizedComponent } from './backoffice-unauthorized/backoffice-unauthorized.component';
import { BackofficeAuthGuard } from './guards/backoffice-auth.guard';


@NgModule({
  declarations: [
    DashboardComponent,
    MainBackofficeComponent,
    BackofficeNavbarComponent,
    BackofficeSidebarComponent,
    BackofficeFooterComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    ShowComponent,
    AddUsersComponent,
    UpdateUsersComponent,
    NotFoundComponent,
    BackofficeUnauthorizedComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    BackofficeAuthGuard
  ]
})
export class BackofficeModule { }
