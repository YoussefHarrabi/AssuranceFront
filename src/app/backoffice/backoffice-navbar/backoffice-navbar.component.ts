import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/client/Services/UserServices/Authentication/auth.service';
import { UserService } from '../Services/Users/user.service';

@Component({
  selector: 'app-backoffice-navbar',
  templateUrl: './backoffice-navbar.component.html',
  styleUrls: ['./backoffice-navbar.component.css']
})
export class BackofficeNavbarComponent implements OnInit, OnDestroy {
  currentUserName = 'Youssef Harrabi';
  currentUserEmail = '';
  currentTime!: string;
  
  // Update the time every second
  private timeInterval: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) { 
    this.updateCurrentTime();
  }

  ngOnInit(): void {
    // Update the time every second
    this.timeInterval = setInterval(() => this.updateCurrentTime(), 1000);
    
    // Get current user information from token if available
    if (this.userService.isAuthenticated()) {
      this.currentUserName = this.userService.getCurrentUserName();
      this.currentUserEmail = this.userService.getCurrentUserEmail();
    }
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateCurrentTime(): void {
    this.currentTime = this.userService.getFormattedCurrentTime();
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
    
    // Navigate to login page
    this.router.navigate(['backoffice/login']);
  }
}