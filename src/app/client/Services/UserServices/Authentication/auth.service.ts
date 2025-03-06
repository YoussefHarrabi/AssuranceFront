import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from 'src/app/Models/Users/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8084/api/auth';
  private mfaApiUrl = 'http://localhost:8084/api/mfa';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();
  
  // New property to temporarily store email during MFA verification
  private pendingMfaEmail: string | null = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          // Check if MFA is required
          if (response.requiresMfa) {
            // Store email for later MFA verification
            this.pendingMfaEmail = email;
            return response; // Return response with requiresMfa flag
          }
          
          // Standard login flow (no MFA required)
          if (response && response.token) {
            this.storeUserData(response.token);
          }
          return response;
        }),
        catchError(error => {
          console.error('Login failed', error);
          return this.handleError(error);
        })
      );
  }
  
  // New method for MFA verification
  verifyMfa(code: string): Observable<any> {
    if (!this.pendingMfaEmail) {
      return of({ error: 'No pending MFA verification' });
    }
    
    return this.http.post<any>(`${this.apiUrl}/verify-mfa`, { 
      email: this.pendingMfaEmail, 
      code: code 
    }).pipe(
      tap(response => {
        if (response && response.token) {
          this.storeUserData(response.token);
          this.pendingMfaEmail = null; // Clear pending email
        }
      }),
      catchError(error => {
        console.error('MFA verification failed', error);
        return this.handleError(error);
      })
    );
  }
  
  // Method to get pending MFA email
  getPendingMfaEmail(): string | null {
    return this.pendingMfaEmail;
  }
  
  // New method to set pending MFA email (useful for when returning to login page)
  setPendingMfaEmail(email: string): void {
    this.pendingMfaEmail = email;
  }

  // MFA Setup - Generate QR code and secret
  setupMfa(): Observable<any> {
    return this.http.get<any>(`${this.mfaApiUrl}/setup`).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  // MFA Enable - Verify code and enable MFA
  enableMfa(code: string): Observable<any> {
    return this.http.post<any>(`${this.mfaApiUrl}/enable`, { code }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  // MFA Status - Check if MFA is enabled
  getMfaStatus(): Observable<any> {
    return this.http.get<any>(`${this.mfaApiUrl}/status`).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  // MFA Disable - Disable MFA with verification code
  disableMfa(code: string): Observable<any> {
    return this.http.post<any>(`${this.mfaApiUrl}/disable`, { code }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.pendingMfaEmail = null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Get user profile information
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  // Refresh user data from server
  refreshUserData(): Observable<User> {
    return this.getCurrentUserProfile().pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => this.handleError(error))
    );
  }
  
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log('Registration successful', response);
      }),
      catchError(error => {
        console.error('Registration failed', error);
        return this.handleError(error);
      })
    );
  }
  
  registerAdmin(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-admin`, userData).pipe(
      tap(response => {
        console.log('Admin registration successful', response);
      }),
      catchError(error => {
        console.error('Admin registration failed', error);
        return this.handleError(error);
      })
    );
  }
  
  // Request a password reset link
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password/forgot`, { email }).pipe(
      catchError(error => {
        console.error('Password reset request failed', error);
        return this.handleError(error);
      })
    );
  }

  // Validate reset token
  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/password/validate-token?token=${token}`).pipe(
      catchError(error => {
        console.error('Token validation failed', error);
        return this.handleError(error);
      })
    );
  }

  // Reset password with token
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password/reset`, { token, password }).pipe(
      catchError(error => {
        console.error('Password reset failed', error);
        return this.handleError(error);
      })
    );
  }
  
  // Helper method to store user data from token
  private storeUserData(token: string): void {
    localStorage.setItem('token', token);
    
    // Extract user information from the token
    const decodedToken = this.jwtHelper.decodeToken(token);
    
    // Create a partial user object from token claims
    const user: Partial<User> = {
      id: decodedToken.id,
      email: decodedToken.sub, // Usually the email is in the subject claim
      roles: new Set(decodedToken.roles)
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user as User);
  }
  
  // Standardized error handling
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error && error.error.message) {
      // Server sent an error message
      errorMessage = error.error.message;
    } else if (error.message) {
      // Use the error message property
      errorMessage = error.message;
    } else if (error.status) {
      // Use the HTTP status text
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}