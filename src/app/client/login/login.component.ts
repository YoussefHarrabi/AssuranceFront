import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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
  }

  onSubmit(): void {
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
              this.router.navigate([this.returnUrl]);
            }
          },
          error: (error) => {
            this.errorMessage = error.message || 'Login failed. Please check your credentials.';
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
          this.errorMessage = error.message || 'Invalid verification code. Please try again.';
        }
      });
  }

  backToLogin(): void {
    this.requiresMfa = false;
    this.errorMessage = '';
  }
}