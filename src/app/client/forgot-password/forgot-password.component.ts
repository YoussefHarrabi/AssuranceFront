import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  message = '';
  isError = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }

  onSubmit(): void {
    this.isSubmitted = true;
    this.isLoading = true;
    this.message = '';

    // Stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      this.isLoading = false;
      return;
    }

    const email = this.f['email'].value;

    this.authService.requestPasswordReset(email)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isError = false;
          this.message = 'Password reset link has been sent to your email address.';
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.message = error.error?.message || 'Failed to request password reset. Please try again.';
        }
      });
  }
}