import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';
import { Role } from 'src/app/Models/Users/enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentDateTime: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Format the current date and time as UTC
    this.updateCurrentDateTime();
    
    // Check if user is admin and redirect if needed
    this.checkUserRole();
  }
  
  /**
   * Updates the current date and time in the required format
   */
  updateCurrentDateTime(): void {
    const now = new Date();
    
    // Format as YYYY-MM-DD HH:MM:SS in UTC
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  /**
   * Checks if the current user has admin role and redirects if needed
   */
  private checkUserRole(): void {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      // Get the current user's data
      const currentUser = this.authService.currentUserValue;
      // Check if user has admin role
      if (currentUser && currentUser.roles && 
          (currentUser.roles instanceof Set ? 
           currentUser.roles.has(Role.ADMIN) : 
           Array.isArray(currentUser.roles) && (currentUser.roles as string[]).includes('ADMIN'))) {
        
        // User is an admin, redirect to admin dashboard
        this.router.navigate(['/backoffice']);
      }
    }
  }
  
  /**
   * Gets the current user's name for display
   * @returns The user's name or 'Guest' if not logged in
   */
  getUserName(): string {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser && currentUser.firstName) {
      return currentUser.firstName;
    }
    
    return 'Guest';
  }
}