import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent  implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to auth changes to update the UI
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Initialize on component load
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['client/login']);
  }
}