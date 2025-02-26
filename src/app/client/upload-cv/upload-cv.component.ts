import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { JobApplicationServiceService } from '../job-application-service.service';


@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.component.html',
  styleUrls: ['./upload-cv.component.css']
})
export class UploadCvComponent {
  uploadCvForm: FormGroup;
  cvFile: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadCvComponent>,
    private jobApplicationService: JobApplicationServiceService
  ) {
    this.uploadCvForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cv: [null, Validators.required]
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.cvFile = reader.result;
        this.uploadCvForm.patchValue({
          cv: this.cvFile
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.uploadCvForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('email', this.uploadCvForm.get('email')?.value);
    formData.append('cv', this.cvFile as string);

    this.jobApplicationService.addJobApplication(formData).subscribe(
      () => {
        alert('Candidature envoyée avec succès');
        this.dialogRef.close();
      },
      (error) => {
        alert('Erreur lors de l\'envoi de la candidature');
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}