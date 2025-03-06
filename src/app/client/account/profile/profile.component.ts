import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/UserServices/Authentication/auth.service';
import { User } from 'src/app/Models/Users/user';
import { finalize } from 'rxjs';

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
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  loadUserProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.currentUser = this.authService.currentUserValue;
    
    // If we need to refresh user data from server
    this.authService.getCurrentUserProfile()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error loading profile data.';
        }
      });
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}