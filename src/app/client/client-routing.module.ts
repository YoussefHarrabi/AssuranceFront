import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { InsuranceProComponent } from './InsurancePro/insurance-pro/insurance-pro.component';
import { InsuranceProFormComponent } from './InsurancePro/insurance-pro-form/insurance-pro-form.component';

const routes: Routes = [
  {
    path: '', component: MainClientComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'insurance-pro', component: InsuranceProComponent },
      { path: 'insurance-pro/add', component: InsuranceProFormComponent },
      { path: 'insurance-pro/add/:id', component: InsuranceProFormComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
