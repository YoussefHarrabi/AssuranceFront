import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backoffice-unauthorized',
  templateUrl: './backoffice-unauthorized.component.html',
  styleUrls: ['./backoffice-unauthorized.component.css']
})
export class BackofficeUnauthorizedComponent {
  currentTime: string;
  
  constructor(
    private router: Router
  ) {
    // Set current time
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
  
  goToLogin(): void {
    this.router.navigate(['/backoffice/login']);
  }
}