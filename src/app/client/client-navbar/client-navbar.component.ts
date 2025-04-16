import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent  implements OnInit {
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | null = null;
  private timeInterval: any;
  

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    // Subscribe to auth changes to update the UI
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      
      // If user is logged in but we don't have profile data, fetch it
      if (this.isLoggedIn && user && !user.firstName) {
        this.fetchUserProfile();
      }
    });
    
    // Initialize on component load
    this.isLoggedIn = this.authService.isAuthenticated();
    
    // If logged in, fetch profile data
    if (this.isLoggedIn) {
      this.fetchUserProfile();
    }
    
    // Update time periodically
    this.timeInterval = setInterval(() => {
      // This will trigger change detection for the getCurrentDateTime method
    }, 1000);
  }
  
  /**
   * Fetch complete user profile data
   */
  fetchUserProfile(): void {
    this.authService.fetchUserProfile().subscribe({
      next: () => {
        // User profile updated in the service
        // No need to do anything here as our template uses methods that read from the service
      },
      error: error => {
        console.error('Error fetching user profile:', error);
      }
    });
  }
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    // Clear the interval
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

/**
 * Gets the current user's name - falls back to email since JWT doesn't include first/last name
 */
getUserName(): string {
  const user = this.authService.currentUserValue;
  console.log(user);
  // If we have stored user profile data with name, use that
  if (user && user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } 
  
  // Otherwise just use the email from JWT
  if (user && user.email) {
    // Format the email to look more like a username (e.g., youssef@example.com → youssef)
    const emailName = user.email.split('@')[0];
    return this.capitalizeFirstLetter(emailName);
  }
  
  // Fallback
  return 'YoussefHarrabi'; // Default username as per your requirement
}

/**
 * Helper method to capitalize the first letter of a string
 */
private capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
 
  /**
   * Returns the current date and time in the required format
   */
  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['client/login']);
  }
}