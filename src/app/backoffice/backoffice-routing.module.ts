import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { ProfileComponent } from './profile/profile.component';
import { ListTypeAssuranceComponent } from './list-type-assurance/list-type-assurance.component';
import { EditTypeAssuranceComponent } from './edit-type-assurance/edit-type-assurance.component';
import { TypeAssuranceStatisticsComponent } from './type-assurance-statistics/type-assurance-statistics.component';
import { ListAssuranceComponent } from './list-assurance/list-assurance.component';
import { AssuranceParticulierComponent } from '../client/assurance-particulier/assurance-particulier.component';

const routes: Routes = [
  {
    path: '', component: MainBackofficeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'ListAssurances', component: ListAssuranceComponent },
      { path: 'Update-Insurance/:id', component: AssuranceParticulierComponent },
      { path: 'types', component: ListTypeAssuranceComponent },
      { path: 'chart', component: TypeAssuranceStatisticsComponent },
      { path: 'Add-TypeAssurance', component: EditTypeAssuranceComponent },
      { path: 'edit/:id', component: EditTypeAssuranceComponent },

      // Assurance Routes
    

      // Autres routes
      { path: 'profile', component: ProfileComponent },

      // ✅ Correction de la redirection
      { path: '**', redirectTo: 'types' },
      // Redirige vers /types si l'URL est invalide
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
