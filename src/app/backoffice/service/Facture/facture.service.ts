import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../../models/facture';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private baseUrl = 'http://localhost:8089/api/factPaim';
  private pdfUrl = 'http://localhost:8089/api/pdf/facture';

  constructor(private http: HttpClient) {}

  /** Récupérer toutes les factures */
  getAllFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}/factures`);
  }

  /** Récupérer une facture par ID */
  getFactureById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/factures/${id}`);
  }

  /** Ajouter une nouvelle facture */
  addFacture(facture: Facture): Observable<void> {
    const factureToSend = {
      montant: facture.montant,
      dateEmission: facture.dateEmission,
      factureStatut: facture.factureStatut,
      user: {
        id: facture.user?.id
      }
    };

    return this.http.post<void>(`${this.baseUrl}/addFacture`, factureToSend);
  }

  /** Mettre à jour une facture */
  updateFacture(facture: Facture): Observable<void> {
    const factureToUpdate = {
      factureId: facture.factureId,
      montant: facture.montant,
      dateEmission: facture.dateEmission,
      factureStatut: facture.factureStatut,
      user: {
        id: facture.user?.id
      }
    };

    return this.http.put<void>(`${this.baseUrl}/updateFact/${facture.factureId}`, factureToUpdate);
  }

  /** Supprimer une facture par ID */
  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/factures/${id}`);
  }

  /** Télécharger une facture en PDF */
  downloadFacturePdf(factureId: number): Observable<Blob> {
    return this.http.get(`${this.pdfUrl}/${factureId}`, { responseType: 'blob' });
  }

   /** Envoyer un email de notification pour une facture */
   sendFactureEmail(factureId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${factureId}/send-notification`, {});
  }
}
