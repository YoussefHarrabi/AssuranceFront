import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Material Modules
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Routing
import { BackofficeRoutingModule } from './backoffice-routing.module';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { BackofficeNavbarComponent } from './backoffice-navbar/backoffice-navbar.component';
import { BackofficeSidebarComponent } from './backoffice-sidebar/backoffice-sidebar.component';
import { BackofficeFooterComponent } from './backoffice-footer/backoffice-footer.component';
import { ProfileComponent } from './profile/profile.component';
import { FactureComponent } from './facture/facture.component';
import { AddFactureComponent } from './add-facture/add-facture.component';
import { UpdateFactureComponent } from './update-facture/update-facture.component';

// Services
import { UserService } from './service/User/user.service';

// Third-party modules
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DashboardComponent,
    MainBackofficeComponent,
    BackofficeNavbarComponent,
    BackofficeSidebarComponent,
    BackofficeFooterComponent,
    ProfileComponent,
    FactureComponent,
    AddFactureComponent,
    UpdateFactureComponent,
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatSnackBarModule,
  ],
  providers: [UserService]
})
export class BackofficeModule { }
