import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityType, Role } from 'src/app/Models/Users/enum';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';
import { User } from 'src/app/Models/Users/user';
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
  identityTypes = Object.values(IdentityType);

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

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Create user data from form, excluding confirmPassword
    const userData = {...this.registerForm.value};
    delete userData.confirmPassword;
    
    // Convert birthday to a Date object
    if (userData.birthday) {
      userData.birthday = new Date(userData.birthday);
    }
    
    // Call register service from AuthService
    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: true }});
      },
      error: error => {
        this.error = error?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}