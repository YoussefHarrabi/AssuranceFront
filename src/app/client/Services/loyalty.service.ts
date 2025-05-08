import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './UserServices/Authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  private apiUrl = 'http://localhost:8084/api/loyalty';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Get headers with auth token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }

  // USER LOYALTY METHODS
  
  // Get current user's loyalty information
  getUserLoyaltyInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/info`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Complete a challenge
  completeChallenge(challengeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/complete-challenge/${challengeId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Redeem a bonus
  redeemBonus(bonusId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/redeem-bonus/${bonusId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // BONUSES METHODS
  
  // Get all bonuses
  getAllBonuses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bonuses`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get available bonuses
  getAvailableBonuses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bonuses/available`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get bonuses by points
  getBonusesByPoints(points: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bonuses/available-with-points/${points}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get bonus by ID
  getBonusById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bonuses/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Create a new bonus
  createBonus(bonusData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bonuses`, bonusData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Update a bonus
  updateBonus(id: number, bonusData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bonuses/${id}`, bonusData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Delete a bonus
  deleteBonus(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bonuses/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // CHALLENGES METHODS
  
  // Get all challenges
  getAllChallenges(): Observable<any> {
    return this.http.get(`${this.apiUrl}/challenges`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get active challenges
  getActiveChallenges(): Observable<any> {
    return this.http.get(`${this.apiUrl}/challenges/active`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get current challenges
  getCurrentChallenges(): Observable<any> {
    return this.http.get(`${this.apiUrl}/challenges/current`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get challenge by ID
  getChallengeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/challenges/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Create a new challenge
  createChallenge(challengeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/challenges`, challengeData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Update a challenge
  updateChallenge(id: number, challengeData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/challenges/${id}`, challengeData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Delete a challenge
  deleteChallenge(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/challenges/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // LOYALTY STATUS METHODS
  
  // Get all loyalty statuses
  getAllLoyaltyStatuses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get loyalty status by ID
  getLoyaltyStatusById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Create a new loyalty status
  createLoyaltyStatus(statusData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/status`, statusData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Update a loyalty status
  updateLoyaltyStatus(id: number, statusData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/status/${id}`, statusData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ADMIN ONLY: Delete a loyalty status
  deleteLoyaltyStatus(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/status/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  // Get user's completed challenges
getUserCompletedChallenges(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/completed-challenges`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  // Get user's redeemed bonuses
  getUserRedeemedBonuses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/redeemed-bonuses`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  getUserCompletedChallengeIds(): Observable<number[]> {
    return this.http.get<any>(`${this.apiUrl}/user/completed-challenges`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        // Extract only the IDs from the completedChallenges array
        if (response && response.completedChallenges && Array.isArray(response.completedChallenges)) {
          return response.completedChallenges.map((challenge: any) => challenge.id);
        }
        return [];
      }),
      catchError(error => this.handleError(error))
    );
  }
  
  // Get just the IDs of redeemed bonuses// In LoyaltyService
getUserRedeemedBonusIds(): Observable<number[]> {
    return this.http.get<any>(`${this.apiUrl}/user/redeemed-bonuses`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        // If the response is an array of bonus objects
        if (Array.isArray(response)) {
          return response.map(bonus => bonus.id);
        }
        // If the response contains a redeemedBonuses array
        else if (response && Array.isArray(response.redeemedBonuses)) {
          return response.redeemedBonuses.map((bonus: any) => bonus.id);
        }
        // Return empty array if no redeemed bonuses
        return [];
      }),
      catchError(error => {
        console.error('Error getting redeemed bonuses:', error);
        return of([]);  // Return empty array on error
      })
    );
  }
}