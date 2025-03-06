import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../Services/Users/user.service';

@Injectable({
  providedIn: 'root'
})
export class BackofficeAuthGuard implements CanActivate {
  
  constructor(
    private backofficeUserService: UserService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is authenticated
    if (!this.backofficeUserService.isAuthenticated()) {
      // Redirect to backoffice login
      this.router.navigate(['/backoffice/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    // Check if user is admin
    if (!this.backofficeUserService.isAdmin()) {
      // Redirect to unauthorized page
      this.router.navigate(['/backoffice/unauthorized']);
      return false;
    }
    
    return true;
  }
}