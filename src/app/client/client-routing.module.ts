import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { EditReclamationComponent } from './edit-reclamation/edit-reclamation.component';
import { ResponseDetailComponent } from './response-detail/response-detail.component';

const routes: Routes = [
  {
    path: '', component: MainClientComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'addReclamation', component: AddReclamationComponent },
      { path: 'complaintList', component: ReclamationListComponent },
      { path: 'editComplaint/:id', component: EditReclamationComponent },
      { path: 'responseDetail/:id', component: ResponseDetailComponent },
      { path: '', redirectTo: '/client/reclamationList', pathMatch: 'full' },
      { path: '**', redirectTo: '/client/reclamationList' }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
