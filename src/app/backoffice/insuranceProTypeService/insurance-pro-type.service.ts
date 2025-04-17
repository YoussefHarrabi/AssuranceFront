import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsuranceProType } from 'src/app/models/InsuranceProType';

@Injectable({
  providedIn: 'root'
})
export class InsuranceProTypeService {

private apiUrl = 'http://localhost:8081/Gharbi/api/insuranceProTypes';

constructor(private http: HttpClient) {}

getAll(): Observable<InsuranceProType[]> {
  return this.http.get<InsuranceProType[]>(this.apiUrl);
}

getById(id: number): Observable<InsuranceProType> {
  return this.http.get<InsuranceProType>(`${this.apiUrl}/${id}`);
}

create(data: InsuranceProType): Observable<InsuranceProType> {
  return this.http.post<InsuranceProType>(this.apiUrl, data);
}

update(data: InsuranceProType): Observable<InsuranceProType> {
  return this.http.put<InsuranceProType>(`${this.apiUrl}`, data);
}

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}