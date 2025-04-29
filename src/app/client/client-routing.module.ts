import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { AssuranceParticulierComponent } from './assurance-particulier/assurance-particulier.component';

import { AssuranceDetailComponent } from './assurance-detail/assurance-detail.component';

import { ListComponent } from './list/list.component';




const routes: Routes = [
  {
    path: '', component: MainClientComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'List', component: ListComponent },
      { path: 'Update-Insurance/:id', component: AssuranceParticulierComponent },
      { path: 'assurance/:id', component: AssuranceDetailComponent },
      { path: 'Add-Insurance', component: AssuranceParticulierComponent },
      { path: 'Update-Insurance/:id', component: AssuranceParticulierComponent },
      { path: '**', redirectTo: 'List', pathMatch: 'full' },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
