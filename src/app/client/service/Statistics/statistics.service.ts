import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SocieteStats {
  montantTotal: number;
  montantPaye: number;
  montantNonPaye: number;
  montantEnAttente: number;
  nombreFacturesPayees: number;
  nombreFacturesNonPayees: number;
  nombreFacturesEnAttente: number;
  nombreTotalFactures: number;
  gainPotentiel: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8089/api/statistics';

  constructor(private http: HttpClient) { }

  getStatistiquesSociete(): Observable<SocieteStats> {
    return this.http.get<SocieteStats>(`${this.apiUrl}/societe`);
  }


}
