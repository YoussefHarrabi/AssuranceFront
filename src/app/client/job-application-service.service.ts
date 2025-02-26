import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobApplication } from '../backoffice/ModelsCarrieres/job-application.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationServiceService {
  private apiUrl = `http://localhost:8084/api/JobApplication`;

  constructor(private http: HttpClient) {}

  addJobApplication(jobApplication:JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.apiUrl}`, jobApplication);
  }

  getJobApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.apiUrl);
  }

  getJobApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  updateJobApplication(id: number, jobApplication: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/${id}`, jobApplication);
  }

  deleteJobApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
 
}
