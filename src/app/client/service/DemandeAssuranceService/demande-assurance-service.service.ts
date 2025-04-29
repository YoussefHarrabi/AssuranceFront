import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssuranceParticular } from '../../models/assurance-particular.modelV';


@Injectable({
  providedIn: 'root'
})
export class DemandeAssuranceService {
  private baseUrl = 'http://localhost:8089/Insurance'; // ✅ Vérifier l'URL du backend

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    })
  };

  constructor(private http: HttpClient) {}

  // ✅ Ajouter une demande avec typeAssurance
  addDemande(demande: AssuranceParticular): Observable<AssuranceParticular> {
    return this.http.post<AssuranceParticular>(`${this.baseUrl}/add`, demande, this.httpOptions);
  }

  // ✅ Récupérer toutes les demandes
  getAllDemandes(): Observable<AssuranceParticular[]> {
    return this.http.get<AssuranceParticular[]>(`${this.baseUrl}/all`, this.httpOptions);
  }

  // ✅ Récupérer une demande par ID
  getDemandeById(id: number): Observable<AssuranceParticular> {
    return this.http.get<AssuranceParticular>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  // ✅ Mettre à jour une demande
  updateDemande(id: number, demande: AssuranceParticular): Observable<AssuranceParticular> {
    return this.http.put<AssuranceParticular>(`${this.baseUrl}/update/${id}`, demande, this.httpOptions);
  }

  // ✅ Supprimer une demande (correction du type Observable<string>)
  deleteDemande(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete/${id}`, { responseType: 'text' as 'json' });
  }
  // Ajouter dans demande-assurance-service.service.ts
  updateStatus(id: number, status: string, email: string): Observable<any> {
    const url = `http://localhost:8089/Insurance/update-status/${id}?status=${status}&email=${email}`;
    return this.http.put<any>(url, {});
  }
  
}
