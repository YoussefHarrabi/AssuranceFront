import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/UserServices/Authentication/auth.service';
import { User } from 'src/app/Models/Users/user';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'profile';
  currentUser: User | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // System info
  systemInfo: any = {
    currentDateTime: '2025-04-16 00:30:00',
    username: 'YoussefHarrabi',
    serverVersion: '1.0.0'
  };
  
  // Form for profile editing
  profileForm: FormGroup;
  editingProfile: boolean = false;
  
  // Form for password change
  passwordForm: FormGroup;
  changingPassword: boolean = false;
  
  // Login activity
  loginActivity: any = null;
  loadingActivity: boolean = false;
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['']
    });
    
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    // Inject the system info directly instead of loading it
    // this.loadSystemInfo();
  }
  
  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
  
  loadUserProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // First check if we already have a user in memory
    this.currentUser = this.authService.currentUserValue;
    
    // Always refresh from server to get latest data
    this.authService.getCurrentUserProfile()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          // Update form values when user data is loaded
          this.updateProfileForm();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error loading profile data.';
        }
      });
  }
  
  loadLoginActivity(): void {
    if (this.loginActivity) return; // Only load once
    
    this.loadingActivity = true;
    this.authService.getLoginActivity()
      .pipe(
        finalize(() => {
          this.loadingActivity = false;
        })
      )
      .subscribe({
        next: (activity) => {
          this.loginActivity = activity;
        },
        error: (error) => {
          console.error('Error loading login activity:', error);
        }
      });
  }
  
  updateProfileForm(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        phoneNumber: this.currentUser.phoneNumber,
        address: this.currentUser.address
      });
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // Load tab-specific data
    if (tab === 'security') {
      this.loadLoginActivity();
    }
    
    // Reset messages when changing tabs
    this.errorMessage = '';
    this.successMessage = '';
  }
  
  startEditProfile(): void {
    this.editingProfile = true;
    this.updateProfileForm();
  }
  
  cancelEditProfile(): void {
    this.editingProfile = false;
    this.updateProfileForm(); // Reset form to original values
  }
  
  submitProfileUpdate(): void {
    if (this.profileForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const updates = this.profileForm.value;
    
    this.authService.updateProfile(updates)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = 'Profile updated successfully';
          this.editingProfile = false;
          // Refresh user data
          this.loadUserProfile();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error updating profile';
        }
      });
  }
  
  startChangePassword(): void {
    this.changingPassword = true;
    this.passwordForm.reset();
  }
  
  cancelChangePassword(): void {
    this.changingPassword = false;
    this.passwordForm.reset();
  }
  
  submitPasswordChange(): void {
    if (this.passwordForm.invalid) {
      return;
    }
    
    const { currentPassword, newPassword } = this.passwordForm.value;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.changePassword(currentPassword, newPassword)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = 'Password changed successfully';
          this.changingPassword = false;
          this.passwordForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error changing password';
        }
      });
  }
}