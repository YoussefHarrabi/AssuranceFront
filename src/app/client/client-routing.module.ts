import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { PaiementComponent } from './paiement/paiement.component';
import { StatisticsComponentComponent } from './statistics-component/statistics-component.component';

const routes: Routes = [
  {
    path: '', component: MainClientComponent,
    children: [
      { path: '', component: HomeComponent },
      {path: 'paiements/:factureId', component: PaiementComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
