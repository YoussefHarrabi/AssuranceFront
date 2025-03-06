import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MfaSetupComponent } from './mfa-setup/mfa-setup.component';
import { ProfileComponent } from './account/profile/profile.component';

const routes: Routes = [
  {
    path: '', component: MainClientComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent}, 
      { path: 'register', component: RegisterComponent},
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
 
      {
        path: 'account',
        component: ProfileComponent,
        
      },
      {
        path: 'account/security',
        component: MfaSetupComponent,
       
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
