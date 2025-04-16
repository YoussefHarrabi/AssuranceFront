import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { GoogleAuthService } from '../Services/UserServices/Authentication/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  mfaForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  requiresMfa = false;
  returnUrl: string = '/client';
  // Add these properties to your component
attemptCount: number = 0;
maxAttempts: number = 5;
lockoutTime: number | null = null;

// Add this method to your component
handleFailedLogin(): void {
  this.attemptCount++;
  
  if (this.attemptCount >= this.maxAttempts) {
    // Lock the login form for 5 minutes
    this.lockoutTime = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Set error message
    this.errorMessage = `Too many failed login attempts. Please try again in 5 minutes.`;
    
    // Start a timer to unlock the form after the lockout period
    setTimeout(() => {
      this.lockoutTime = null;
      this.attemptCount = 0;
    }, 5 * 60 * 1000);
  }
}

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private googleAuthService: GoogleAuthService,  // Add this

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.mfaForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/client']);
      return;
    }
    
    // Get return URL from route parameters or default to '/client'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/client';
    
    // Check if there's a pending MFA verification
    const pendingEmail = this.authService.getPendingMfaEmail();
    if (pendingEmail) {
      this.requiresMfa = true;
      // Pre-fill the email field
      this.loginForm.patchValue({ email: pendingEmail });
    }
    
    // Handle query parameters for errors and MFA
    this.route.queryParams.subscribe(params => {
      // Check for MFA required from query params (for Google OAuth)
      if (params['mfaRequired'] === 'true') {
        this.requiresMfa = true;
        // Store the provider and email for verification
        const providerEmail = params['email'];
        if (providerEmail) {
          this.authService.setPendingMfaEmail(providerEmail);
        }
      }
      
      // Add error handling for OAuth errors
      if (params['error'] === 'google_auth_failed') {
        this.errorMessage = params['message'] || 'Google authentication failed. Please try again.';
      }
    });
  }

  signInWithGoogle(): void {
    this.googleAuthService.signIn();
  }
  onSubmit(): void {
     // Check if the login form is locked
  if (this.lockoutTime && Date.now() < this.lockoutTime) {
    const remainingTime = Math.ceil((this.lockoutTime - Date.now()) / 60000); // in minutes
    this.errorMessage = `Too many failed login attempts. Please try again in ${remainingTime} minute(s).`;
    return;
  }
    // Mark all fields as touched to trigger validation
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
  
    this.isSubmitting = true;
    this.errorMessage = '';
  
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    
    if (email && password) {
      this.authService.login(email, password)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.requiresMfa) {
              // MFA is required
              this.requiresMfa = true;
            } else {
              // Standard login successful
              this.router.navigate(['/client']);
            }
          },
          error: (error) => {
              // Track failed login attempts
            if (error.status === 401) {
              this.handleFailedLogin();
            }
            // Enhanced error handling
            if (error.status === 401) {
              this.errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.status === 403) {
              this.errorMessage = 'Your account is locked. Please contact support.';
            } else if (error.status === 404) {
              this.errorMessage = 'User not found. Please check your email address.';
            } else if (error.message) {
              // Use the error message from the response if available
              this.errorMessage = error.message;
            } else {
              // Default error message
              this.errorMessage = 'Login failed. Please try again later.';
            }
            
            // Log the error for debugging (optional)
            console.error('Login error:', error);
          }
        });
    }
  }

  onVerifyMfa(): void {
    if (this.mfaForm.invalid) {
      Object.keys(this.mfaForm.controls).forEach(key => {
        const control = this.mfaForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
  
    this.isSubmitting = true;
    this.errorMessage = '';
  
    const code = this.mfaForm.get('code')?.value;
  
    this.authService.verifyMfa(code)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          // Enhanced MFA error handling
          if (error.status === 401) {
            this.errorMessage = 'Invalid verification code. Please try again.';
          } else if (error.status === 410) {
            this.errorMessage = 'Verification code has expired. Please request a new code.';
          } else if (error.status === 429) {
            this.errorMessage = 'Too many failed attempts. Please try again later.';
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Verification failed. Please try again.';
          }
          
          // Log the error for debugging (optional)
          console.error('MFA verification error:', error);
        }
      });
  }

  backToLogin(): void {
    this.requiresMfa = false;
    this.errorMessage = '';
  }
}