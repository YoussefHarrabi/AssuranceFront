import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { AssuranceParticulierComponent } from './assurance-particulier/assurance-particulier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AssuranceDetailComponent } from './assurance-detail/assurance-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListComponent } from './list/list.component';






@NgModule({
  declarations: [
    HomeComponent,
    MainClientComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    AssuranceParticulierComponent,
    AssuranceDetailComponent,
    ListComponent,

        
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    HttpClientModule,
        ReactiveFormsModule ,
        FormsModule,
        NgxPaginationModule,
        RouterModule,
  ],
})
export class ClientModule { }
