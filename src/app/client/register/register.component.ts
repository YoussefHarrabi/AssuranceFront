import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityType, Role } from 'src/app/Models/Users/enum';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';
import { User } from 'src/app/Models/Users/user';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  identityTypes = Object.values(IdentityType);
  currentDateTime = '';
  formShake = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() { return this.registerForm.controls; }

  initForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      identityType: [IdentityType.CIN, Validators.required],
      numberOfIdentity: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,}$/)]],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  updateDateTime(): void {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.registerForm.invalid) {
      // Make the form shake to draw attention to the error
      this.formShake = true;
      setTimeout(() => {
        this.formShake = false;
      }, 500);
      return;
    }

    this.loading = true;
    
    // Create user data from form, excluding confirmPassword
    const userData = {...this.registerForm.value};
    delete userData.confirmPassword;
    
    // Convert birthday to the correct format for the API
    if (userData.birthday) {
      userData.birthday = new Date(userData.birthday).toISOString().split('T')[0];
    }
    
    // Call register service from AuthService
    this.authService.register(userData)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.success = 'Registration successful! You can now log in.';
          
          // Reset form
          this.registerForm.reset();
          this.submitted = false;
          
          // Redirect after showing success message
          setTimeout(() => {
            this.router.navigate(['/client/login'], { queryParams: { registered: true }});
          }, 2000);
        },
        error: (error) => {
          // Handle specific error cases
          if (error.status === 409) {
            this.error = 'This email address is already registered. Please use a different email.';
          } else if (error.status === 400) {
            if (error.error && error.error.message) {
              this.error = error.error.message;
            } else if (error.error && Array.isArray(error.error.errors)) {
              // Handle validation errors from Spring Boot
              this.error = error.error.errors.map((err: any) => err.defaultMessage).join(', ');
            } else {
              this.error = 'Invalid registration data. Please check your information and try again.';
            }
          } else {
            this.error = error?.error?.message || 'Registration failed. Please try again later.';
          }
          
          // Log the error for debugging
          console.error('Registration error:', error);
          
          // Make the form shake to draw attention to the error
          this.formShake = true;
          setTimeout(() => {
            this.formShake = false;
          }, 500);
        }
      });
  }
}