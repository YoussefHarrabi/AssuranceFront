import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../Services/UserServices/Authentication/auth.service';

@Component({
  selector: 'app-mfa-setup',
  templateUrl: './mfa-setup.component.html',
  styleUrls: ['./mfa-setup.component.css']
})
export class MfaSetupComponent implements OnInit {
  mfaStatus = {
    enabled: false,
    loading: true
  };
  setupStep = '';
  mfaForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  qrCodeImage = '';
  secret = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.mfaForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit(): void {
    this.checkMfaStatus();
  }

  checkMfaStatus(): void {
    this.mfaStatus.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.getMfaStatus()
      .pipe(finalize(() => {
        this.mfaStatus.loading = false;
      }))
      .subscribe({
        next: (response) => {
          this.mfaStatus.enabled = response.enabled;
          this.setupStep = this.mfaStatus.enabled ? 'enabled' : 'start';
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to check MFA status';
          this.setupStep = 'error';
        }
      });
  }
  

  startSetup(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.setupMfa()
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: (response) => {
          this.qrCodeImage = response.qrCodeImage;
          this.secret = response.secret;
          this.setupStep = 'setup';
          this.mfaForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to set up MFA';
        }
      });
  }

  enableMfa(): void {
    if (this.mfaForm.invalid) {
      Object.keys(this.mfaForm.controls).forEach(key => {
        const control = this.mfaForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const code = this.mfaForm.get('code')?.value;
    
    this.authService.enableMfa(code)
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: () => {
          this.mfaStatus.enabled = true;
          this.setupStep = 'enabled';
          this.successMessage = 'Two-factor authentication has been enabled for your account.';
        },
        error: (error) => {
          this.errorMessage = error.message || 'Invalid verification code. Please try again.';
        }
      });
  }

  showDisableForm(): void {
    this.setupStep = 'disable';
    this.mfaForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  disableMfa(): void {
    if (this.mfaForm.invalid) {
      Object.keys(this.mfaForm.controls).forEach(key => {
        const control = this.mfaForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const code = this.mfaForm.get('code')?.value;
    
    this.authService.disableMfa(code)
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: () => {
          this.mfaStatus.enabled = false;
          this.setupStep = 'start';
          this.successMessage = 'Two-factor authentication has been disabled for your account.';
        },
        error: (error) => {
          this.errorMessage = error.message || 'Invalid verification code. Please try again.';
        }
      });
  }
 
copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).then(
    () => {
      // Show temporary success message
      this.successMessage = "Secret copied to clipboard!";
      setTimeout(() => {
        if (this.successMessage === "Secret copied to clipboard!") {
          this.successMessage = '';
        }
      }, 3000);
    },
    (err) => {
      this.errorMessage = "Could not copy text: " + err;
    }
  );
}

getCurrentDateTime(): string {
  const now = new Date();
  return now.toLocaleString();
}

}
