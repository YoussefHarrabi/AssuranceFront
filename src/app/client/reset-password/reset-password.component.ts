import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  isSubmitted = false;
  message = '';
  isError = false;
  isLoading = false;
  isTokenValid = false;
  tokenValidating = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Password match validator
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.isError = true;
        this.message = 'Invalid reset link. Please request a new password reset.';
        this.tokenValidating = false;
        return;
      }

      this.validateToken();
    });
  }

  validateToken(): void {
    this.authService.validateResetToken(this.token)
      .subscribe({
        next: (response) => {
          this.tokenValidating = false;
          if (response.valid) {
            this.isTokenValid = true;
          } else {
            this.isError = true;
            this.message = response.message || 'Invalid or expired token. Please request a new password reset.';
          }
        },
        error: (error) => {
          this.tokenValidating = false;
          this.isError = true;
          this.message = error.error?.message || 'Invalid or expired token. Please request a new password reset.';
        }
      });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit(): void {
    this.isSubmitted = true;
    this.message = '';

    // Stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const password = this.f['password'].value;

    this.authService.resetPassword(this.token, password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isError = false;
          this.message = 'Password has been reset successfully.';
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            this.router.navigate(['/client/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.message = error.error?.message || 'Failed to reset password. Please try again.';
        }
      });
  }
}