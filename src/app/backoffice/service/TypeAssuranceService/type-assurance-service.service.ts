import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeAssuranceParticular } from '../../models/type-assurance-particular.modelV';

@Injectable({
  providedIn: 'root'
})
export class TypeAssuranceService {
  private baseUrl = 'http://localhost:8089/typeAssurance'; // ✅ Correspond au backend

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    })
  };

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les types d'assurance
  getAllTypes(): Observable<TypeAssuranceParticular[]> {
    return this.http.get<TypeAssuranceParticular[]>(`${this.baseUrl}/All`, this.httpOptions);
  }

  // ✅ Récupérer un type d'assurance par ID
  getTypeById(id: number): Observable<TypeAssuranceParticular> {
    return this.http.get<TypeAssuranceParticular>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  // ✅ Ajouter un type d'assurance
  addType(typeAssurance: TypeAssuranceParticular): Observable<TypeAssuranceParticular> {
    return this.http.post<TypeAssuranceParticular>(`${this.baseUrl}/Add`, typeAssurance, this.httpOptions);
  }

  // ✅ Mettre à jour un type d'assurance
  updateType(id: number, typeAssurance: TypeAssuranceParticular): Observable<TypeAssuranceParticular> {
    return this.http.put<TypeAssuranceParticular>(`${this.baseUrl}/${id}`, typeAssurance, this.httpOptions);
  }
  deleteTypeAssurance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
   // ✅ Récupérer les statistiques des types d'assurance
   getTypeAssuranceStatistics(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/statistics`, this.httpOptions);
  }
  searchType(keyword: string): Observable<TypeAssuranceParticular[]> {
    return this.http.get<TypeAssuranceParticular[]>(`${this.baseUrl}/search?keyword=${keyword}`, this.httpOptions);
  }
  
}
