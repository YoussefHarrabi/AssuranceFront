import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { ProfileComponent } from './profile/profile.component';
import { ReclamationListComponent } from '../backoffice/reclamation-list/reclamation-list.component';

import { EditReclamationComponent } from './edit-reclamation/edit-reclamation.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { ComplaintResponseComponent } from './complaint-response/complaint-response.component';

const routes: Routes = [
  {
    path: '', component: MainBackofficeComponent,
    children: [
      { path: '', component: DashboardComponent },
      {path:'profile',component:ProfileComponent},
      { path: 'complaintList', component: ReclamationListComponent },
      { path: 'addComplaint', component: AddReclamationComponent },
      { path: 'editComplaint/:id', component: EditReclamationComponent },  
      { path: 'reclamations/response/:id', component: ComplaintResponseComponent },

    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
