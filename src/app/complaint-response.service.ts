import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Response } from 'src/app/client/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintResponseService {
  private apiUrl = 'http://localhost:8084/api/responses'; // Change this to your API URL

  constructor(private http: HttpClient) {}

  addResponse(response: Response): Observable<Response> {
    return this.http.post<Response>(this.apiUrl, response);
  }

  updateResponse(response: Response): Observable<Response> {
    return this.http.put<Response>(`${this.apiUrl}/${response.id}`, response);
  }

  getResponses(): Observable<Response[]> {
    return this.http.get<Response[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getResponseById(id: number): Observable<Response> {
    return this.http.get<Response>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something bad happened; please try again later.');
  }
}