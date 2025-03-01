import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Complaint } from './models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8084/api/complaints'; 

  constructor(private http: HttpClient) {}

  addComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint).pipe(
      catchError(this.handleError)
    );
  }

  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${complaint.id}`, complaint).pipe(
      catchError(this.handleError)
    );
  }

  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something bad happened; please try again later.');
  }


  
}