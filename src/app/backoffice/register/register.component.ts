import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityType } from 'src/app/Models/Users/enum';
import { UserService } from '../Services/Users/user.service';


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
  currentTime!: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);
  }
  
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      identityType: ['CIN', [Validators.required]],
      numberOfIdentity: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.getUTCFullYear() + '-' + 
                     this.padZero(now.getUTCMonth() + 1) + '-' + 
                     this.padZero(now.getUTCDate()) + ' ' + 
                     this.padZero(now.getUTCHours()) + ':' + 
                     this.padZero(now.getUTCMinutes()) + ':' + 
                     this.padZero(now.getUTCSeconds());
  }
  
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    this.submitted = true;
    
    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Create the admin registration request object
    const adminUser = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      birthday: this.f['birthday'].value,
      identityType: this.f['identityType'].value,
      numberOfIdentity: this.f['numberOfIdentity'].value,
      phoneNumber: this.f['phoneNumber'].value,
      address: this.f['address'].value,
      // Add the admin role
      roles: ['ADMIN']
    };
    
    this.userService.registerAdmin(adminUser).subscribe({
      next: () => {
        this.success = 'Registration successful';
        this.loading = false;
        
        // Navigate to login page after successful registration
        setTimeout(() => {
          this.router.navigate(['/backoffice/login']);
        }, 2000);
      },
      error: error => {
        this.error = error?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}