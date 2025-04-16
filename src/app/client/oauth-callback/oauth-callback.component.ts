import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from '../Services/UserServices/Authentication/google-auth.service';

@Component({
  selector: 'app-oauth-callback',
  template: `
    <div class="container text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-3">Processing authentication, please wait...</p>
    </div>
  `

})
export class OauthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleAuthService: GoogleAuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        // Handle errors
        this.router.navigate(['/client/login'], { 
          queryParams: { 
            error: 'oauth_error',
            message: error 
          }
        });
        return;
      }

      if (code) {
        // Process the authorization code
        this.googleAuthService.handleCallback(code).subscribe();
      } else {
        // No code found, redirect to login
        this.router.navigate(['/client/login']);
      }
    });
  }
}