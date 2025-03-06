import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainBackofficeComponent } from './main-backoffice/main-backoffice.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ShowComponent } from './GestionUsers/show/show.component';
import { AddUsersComponent } from './GestionUsers/add-users/add-users.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UpdateUsersComponent } from './GestionUsers/update-users/update-users.component';
import { BackofficeAuthGuard } from './guards/backoffice-auth.guard';
import { BackofficeUnauthorizedComponent } from './backoffice-unauthorized/backoffice-unauthorized.component';

const routes: Routes = [
  {
    path: '', component: MainBackofficeComponent,
    children: [
      { path: '', component: DashboardComponent,canActivate: [BackofficeAuthGuard], },
      {path:'profile',component:ProfileComponent,canActivate: [BackofficeAuthGuard],},
      {path:'users',component:ShowComponent,canActivate: [BackofficeAuthGuard],},
      {path:'adduser',component:AddUsersComponent,canActivate: [BackofficeAuthGuard],},
      {path:'updateuser/:id',component:UpdateUsersComponent,canActivate: [BackofficeAuthGuard],},
     
      
      
     
    
    ],
  },
  
  {
    path: 'login', component: LoginComponent
  },
  {path:'register',component:RegisterComponent},

  {path:'unauthorized',component:BackofficeUnauthorizedComponent,},
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
