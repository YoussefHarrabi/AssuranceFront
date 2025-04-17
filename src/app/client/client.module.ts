import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { InsuranceProComponent } from './InsurancePro/insurance-pro/insurance-pro.component';
import { InsuranceProFormComponent } from './InsurancePro/insurance-pro-form/insurance-pro-form.component';
import { InsuranceDialogComponent } from './InsurancePro/insurance-dialog/insurance-dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ Correct usage

const routes: Routes = [
  { path: 'insurancepro', component: InsuranceProComponent },
];

@NgModule({
  declarations: [
    HomeComponent,
    MainClientComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    InsuranceProComponent,
    InsuranceProFormComponent,
    InsuranceDialogComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule // ✅ Correct
  ]
})
export class ClientModule { }
