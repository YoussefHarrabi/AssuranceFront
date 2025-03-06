import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MfaSetupComponent } from './mfa-setup/mfa-setup.component';
import { ProfileComponent } from './account/profile/profile.component';


@NgModule({
  declarations: [
    HomeComponent,
    MainClientComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MfaSetupComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ClientModule { }
