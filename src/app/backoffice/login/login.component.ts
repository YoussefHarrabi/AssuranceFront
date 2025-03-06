import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../Services/Users/user.service';
import { AuthService } from 'src/app/client/Services/UserServices/Authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl!: string;
  currentTime!: string;
  currentUserLogin = 'YoussefHarrabi';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: AuthService,
    private userService2: UserService
  ) {
    // Redirect to dashboard if already logged in
    if (this.userService.isAuthenticated() && this.userService2.isAdmin()) {
      this.router.navigate(['/backoffice']);
    }

    // Update current time every second
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);
  }

  ngOnInit() {
    // Initialize login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/backoffice'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/backoffice';
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

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

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          // Store token and user info
          localStorage.setItem('token', response.token);
          
          // Store user profile information if available
          if (response.user) {
            localStorage.setItem('user_profile', JSON.stringify({
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              email: response.user.email,
              roles: response.user.roles
            }));
          }
          
          // Verify the user is an admin before redirecting to backoffice
          if (this.userService2.isAdmin()) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.error = 'You do not have administrative privileges.';
            this.loading = false;
            // Clear credentials if not admin
            localStorage.removeItem('token');
            localStorage.removeItem('user_profile');
          }
        },
        error: (error) => {
          this.error = error?.error?.message || 'Invalid credentials. Please try again.';
          this.loading = false;
        }
      });
  }
}