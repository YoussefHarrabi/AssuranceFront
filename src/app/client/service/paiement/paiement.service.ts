import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement } from 'src/app/backoffice/models/paiement';
import { Facture } from 'src/app/backoffice/models/facture';

@Injectable({
  providedIn: 'root',
})
export class PaiementService {
  private baseUrl = 'http://localhost:8089/api/paiement';
  private factureUrl = 'http://localhost:8089/api/factPaim/factures'; // Adjust this URL
  private qrCodeUrl = 'http://localhost:8089/api/qrcode';

  constructor(private http: HttpClient) {}

  getFacture(factureId: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.factureUrl}/${factureId}`);
  }

  payerFacture(factureId: number, paiement: Paiement): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/payer/${factureId}`, paiement);
  }

  consulterPaiements(factureId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.baseUrl}/facture/${factureId}`);
  }

  generateQrCode(factureId: number): Observable<Blob> {
    return this.http.get(`${this.qrCodeUrl}/facture/${factureId}`, {
      responseType: 'blob',
      headers: { 'Accept': 'image/png' }
    });
  }

  createPaymentIntent(amount: number, factureId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/stripe/create-intent`, {
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      factureId: factureId
    });
  }

  confirmPayment(paymentIntentId: string, factureId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/stripe/confirm-test/${paymentIntentId}`,
      null,
      { params: { factureId: factureId.toString() } }
    );
  }
}
