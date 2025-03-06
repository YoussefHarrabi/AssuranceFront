import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../client/Services/UserServices/Authentication/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor { constructor(
  private authService: AuthService,
  private router: Router
) {} 

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   // Don't add token for auth endpoints
   if (request.url.includes('/api/auth/login') || 
   request.url.includes('/api/auth/register') || 
   request.url.includes('/api/auth/verify-mfa')) {
 console.log('Skipping JWT for auth endpoint:', request.url);
 return next.handle(request);
}
  
  // Get the token
  const token = this.authService.getToken();
  
  if (token) {
    // Clone the request and add the authorization header
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  // Add error handling
  return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        // If not already on login page, redirect to login
        if (!this.router.url.includes('/login')) {
          this.authService.logout();
          this.router.navigate(['/client/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }
      }
      return throwError(() => error);
    })
  );
}}