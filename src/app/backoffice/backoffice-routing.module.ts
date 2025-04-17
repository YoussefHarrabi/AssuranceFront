import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { ProfileComponent } from './profile/profile.component';
import { FactureComponent } from './facture/facture.component';
import { AddFactureComponent } from './add-facture/add-facture.component';
import { UpdateFactureComponent } from './update-facture/update-facture.component';
import { StatisticsComponentComponent } from '../client/statistics-component/statistics-component.component';

const routes: Routes = [
  {
    path: '',
    component: MainBackofficeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'facture', component: FactureComponent },  // Changé de 'factures' à 'facture'
      { path: 'facture/add', component: AddFactureComponent },  // Changé le chemin
      { path: 'facture/update/:id', component: UpdateFactureComponent }, // Nouvelle route
            {path:'statistics',component:StatisticsComponentComponent}


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
