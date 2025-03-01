import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from './models/complaint.model';
import { ComplaintStatus } from './models/complaint-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8084/api/complaints'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  addComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }

  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  updateComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${complaint.id}`, complaint);
  }
  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateStatus(id: number, status: ComplaintStatus): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/complaints/${id}/status`, { status });
  }
  
}