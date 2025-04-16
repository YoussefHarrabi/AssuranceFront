import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './backoffice/login/login.component';
import { RegisterComponent } from './backoffice/register/register.component';
import { NotFoundComponent } from './backoffice/not-found/not-found.component';
import { OauthCallbackComponent } from './client/oauth-callback/oauth-callback.component';

const routes: Routes = [
  { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
  { path: 'backoffice', loadChildren: () => import('./backoffice/backoffice.module').then(m => m.BackofficeModule) },
  { path: '', redirectTo: '/client', pathMatch: 'full' }, // Redirect to client by default
   // Add the OAuth callback route at the root level
   { path: 'oauth2/callback/google', component: OauthCallbackComponent },
    {
      path:'**',component:NotFoundComponent
      
    },
    

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
