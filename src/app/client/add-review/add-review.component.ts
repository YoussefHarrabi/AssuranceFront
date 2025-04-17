import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../shared/services/review.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  reviewForm: FormGroup;
  categories = ['Service Client', 'Produits', 'Prix', 'Support', 'Autre'];
  isSubmitting = false; // Ajout de la propriété manquante

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router,
    private snackBar: MatSnackBar // Ajout du service MatSnackBar

  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      categories: [[], [Validators.required]],
      isPublic: [true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reviewForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      this.reviewService.createReview(this.reviewForm.value).subscribe({
        next: () => {
          this.snackBar.open('Avis publié avec succès !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          // Redirection vers la liste des reviews
          this.router.navigate(['/client/reviews']);
        },
        error: (error) => {
          console.error('Erreur lors de la publication de l\'avis:', error);
          this.snackBar.open('Erreur lors de la publication de l\'avis', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  // Méthode helper pour l'accès aux contrôles du formulaire dans le template
  get f() {
    return this.reviewForm.controls;
  }

}