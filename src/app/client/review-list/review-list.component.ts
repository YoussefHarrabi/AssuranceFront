import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../shared/services/review.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviews: any[] = [];
  totalReviews = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25, 50];
  isLoading = false;
  selectedReview: any = null;
  deleteModal: any;
  currentUser = 'Zeineb Cherif'; // Assurez-vous que cette valeur correspond à votre utilisateur connecté

  constructor(
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('Current user:', this.currentUser);
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getAllReviews(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          console.log('Reviews loaded:', response);
          if (response && response.content) {
            this.reviews = response.content.map((review: any) => ({
              ...review,
              // Si le client n'a pas de login, on ajoute un login par défaut
              client: review.client || { login: this.currentUser }
            }));
            this.totalReviews = response.totalElements;
            
            // Debug: afficher les reviews après traitement
            console.log('Processed reviews:', this.reviews);
            this.reviews.forEach(review => {
              console.log('Review owner:', review.client?.login);
              console.log('Can delete?', this.canDeleteReview(review));
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading reviews:', error);
          this.isLoading = false;
          this.showErrorMessage('Erreur lors du chargement des avis');
        }
      });
  }

  openDeleteConfirmModal(review: any): void {
    console.log('Opening delete modal for review:', review);
    console.log('Review owner:', review.client?.login);
    console.log('Current user:', this.currentUser);
    
    if (!this.canDeleteReview(review)) {
      this.showErrorMessage('Vous ne pouvez supprimer que vos propres avis');
      return;
    }

    this.selectedReview = review;
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
      this.deleteModal.show();
    }
  }

  confirmDelete(): void {
    if (this.selectedReview && this.selectedReview.id) {
      this.reviewService.deleteReview(this.selectedReview.id).subscribe({
        next: () => {
          if (this.deleteModal) {
            this.deleteModal.hide();
          }
          
          // Mettre à jour la liste locale
          this.reviews = this.reviews.filter(review => review.id !== this.selectedReview?.id);
          this.totalReviews--;
          
          this.showSuccessMessage('Avis supprimé avec succès');
          
          // Recharger la liste après suppression
          this.loadReviews();
        },
        error: (error) => {
          console.error('Delete error:', error);
          if (error.status === 403) {
            this.showErrorMessage('Vous n\'êtes pas autorisé à supprimer cet avis');
          } else {
            this.showErrorMessage('Erreur lors de la suppression de l\'avis');
          }
          if (this.deleteModal) {
            this.deleteModal.hide();
          }
        }
      });
    }
  }

  canDeleteReview(review: any): boolean {
    const canDelete = review.client?.login === this.currentUser;
    console.log(
      `Can delete review ${review.id}?`,
      canDelete,
      `(owner: ${review.client?.login}, current user: ${this.currentUser})`
    );
    return canDelete;
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReviews();
  }

  onMarkHelpful(reviewId: number): void {
    this.reviewService.markAsHelpful(reviewId).subscribe({
      next: () => {
        this.loadReviews();
        this.showSuccessMessage('Avis marqué comme utile');
      },
      error: (error) => {
        console.error('Error marking review as helpful:', error);
        this.showErrorMessage('Erreur lors du marquage de l\'avis comme utile');
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}