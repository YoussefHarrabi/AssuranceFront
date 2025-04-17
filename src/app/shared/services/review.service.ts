import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Review } from '../models/Review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = 'http://localhost:8084/api/reviews';

  constructor(private http: HttpClient) { }

  getAllReviews(page = 0, size = 10): Observable<any> {
    console.log('Fetching reviews with page:', page, 'size:', size);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(response => {
        console.log('Raw API response:', response);
        if (response.content) {
          console.log('Number of reviews:', response.content.length);
          console.log('First review:', response.content[0]);
        }
      })
    );
  }
  // Pour obtenir uniquement les reviews publics
  getPublicReviews(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/public`, { params });
  }
  getReviews(page = 0, size = 10, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status) {
      params = params.set('status', status);
    }
    
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(response => console.log('Reviews fetched:', response))
    );
  }

  getReviewById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      tap(review => console.log('Review fetched:', review))
    );
  }

  createReview(review: any): Observable<any> {
    return this.http.post(this.apiUrl, review).pipe(
      tap(newReview => console.log('Review created:', newReview))
    );
  }

  // Ajout de la méthode markAsHelpful
  markAsHelpful(reviewId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reviewId}/helpful`, {}).pipe(
      tap(() => console.log('Review marked as helpful:', reviewId))
    );
  }

  deleteReview(reviewId: number): Observable<void> {
    console.log('Attempting to delete review with ID:', reviewId);
    const deleteUrl = `${this.apiUrl}/${reviewId}`;
    console.log('Delete URL:', deleteUrl);
    
    return this.http.delete<void>(deleteUrl).pipe(
      tap({
        next: () => console.log(`Review ${reviewId} successfully deleted`),
        error: error => console.error('Delete error:', error)
      })
    );
  }

}