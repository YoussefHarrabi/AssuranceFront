import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private readonly CLIENT_ID = '573701179936-qbunllkm37vdhjtl0mt119148cntrhqj.apps.googleusercontent.com';
  private readonly REDIRECT_URI = 'http://localhost:4200/oauth2/callback/google';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Initiates Google OAuth flow by redirecting to Google's authorization page
   */
  signIn(): void {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const params = {
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent'
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location.href = `${googleAuthUrl}?${urlParams}`;
  }

  /**
   * Handles the OAuth2 callback from Google
   * @param code The authorization code returned by Google
   */
  handleCallback(code: string): Observable<any> {
    if (!code) {
      return of({ error: 'No authorization code present' });
    }

    return this.authService.googleLogin(code, this.REDIRECT_URI).pipe(
      switchMap(response => {
        if (response.requiresMfa) {
          // Redirect to MFA verification page
          this.router.navigate(['/client/login'], { 
            queryParams: { 
              mfaRequired: 'true',
              provider: 'google',
              email: response.email
            }
          });
          return of(response);
        } else {
          // Successful login without MFA
          this.router.navigate(['/client']);
          return of(response);
        }
      }),
      catchError(error => {
        console.error('Error in Google authentication', error);
        this.router.navigate(['/client/login'], { 
          queryParams: { 
            error: 'google_auth_failed',
            message: error.message || 'Google authentication failed'
          }
        });
        return of({ error: error.message || 'Google authentication failed' });
      })
    );
  }
}