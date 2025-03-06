import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/client/Services/UserServices/Authentication/auth.service';
@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {
  adminForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  currentUserLogin = 'YoussefHarrabi';
  currentTime: string;

  identityTypes = ['PASSPORT', 'CIN'];

  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private router: Router
  ) { 
    // Format current date and time
    const now = new Date();
    this.currentTime = now.toISOString().substring(0, 10) + ' ' + 
                      now.toTimeString().substring(0, 8);
  }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthday: ['', Validators.required],
      identityType: ['PASSPORT', Validators.required],
      numberOfIdentity: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['']
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.adminForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.adminForm.invalid) {
      return;
    }

    this.loading = true;
    const adminData = { ...this.adminForm.value };
    
    // Convert birthday to correct format if needed
    if (adminData.birthday) {
      try {
        const date = new Date(adminData.birthday);
        adminData.birthday = date.toISOString().split('T')[0];
      } catch (e) {
        console.error('Date conversion error:', e);
      }
    }

    this.userService.registerAdmin(adminData).subscribe({
      next: (response) => {
        console.log('Admin registered successfully:', response);
        this.router.navigate(['backoffice/users'], { 
          queryParams: { registered: true, email: adminData.email }
        });
      },
      error: (error) => {
        console.error('Admin registration error:', error);
        this.error = error.message || 'Admin registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}