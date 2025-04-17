import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { PaiementComponent } from './paiement/paiement.component';
import { PaiementService } from '../client/service/paiement/paiement.service';
import { FactureService } from '../backoffice/service/Facture/facture.service';
import { StatisticsComponentComponent } from './statistics-component/statistics-component.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';



@NgModule({
  declarations: [
    HomeComponent,
    MainClientComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    PaiementComponent,
    StatisticsComponentComponent,
    StripePaymentComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [PaiementService,FactureService]

})
export class ClientModule { }
