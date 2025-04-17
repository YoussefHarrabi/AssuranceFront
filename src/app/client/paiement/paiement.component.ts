import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaiementService } from '../service/paiement/paiement.service';
import { MethodePaiement } from 'src/app/backoffice/Enums/MethodePaiement.enum';
import { Paiement } from 'src/app/backoffice/models/paiement';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css'],
})
export class PaiementComponent implements OnInit {
  factureId: number = 0;
  facture: any; // Add this property to store the facture details
  paiements: Paiement[] = [];
  montantPaiement: number = 0;
  methodePaiement: string = '';
  listeMethodesPaiement: { key: string, value: string }[] = [];
  qrCodeUrls: { [key: number]: SafeUrl } = {};
  processing: boolean = false;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private paiementService: PaiementService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.factureId = +this.route.snapshot.paramMap.get('factureId')!;
    this.loadFacture();
    this.consulterPaiements();
    this.initialiserMethodesPaiement();
  }
  loadFacture(): void {
    this.loading = true;
    this.paiementService.getFacture(this.factureId).subscribe({
      next: (facture) => {
        this.facture = facture;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading facture:', error);
        this.error = 'Failed to load facture details';
        this.loading = false;
      }
    });
  }

  consulterPaiements(): void {
    this.paiementService.consulterPaiements(this.factureId).subscribe({
      next: (data) => {
        this.paiements = data;
        this.paiements.forEach(paiement => {
          if (paiement.id) {
            this.generateQrCode(paiement.id);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching payments:', error);
      }
    });
  }

  initialiserMethodesPaiement(): void {
    this.listeMethodesPaiement = Object.entries(MethodePaiement).map(([key, value]) => ({
      key,
      value
    }));
  }

  payerFacture(): void {
    if (!this.montantPaiement || this.montantPaiement <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const paiement: Paiement = {
      id: undefined,
      datePaiement: new Date().toISOString(),
      montantPaiement: this.montantPaiement,
      methodePaiement: this.methodePaiement as MethodePaiement,
      facture: null,
    };

    this.processing = true;
    this.paiementService.payerFacture(this.factureId, paiement).subscribe({
      next: () => {
        this.consulterPaiements();
        this.montantPaiement = 0;
        this.methodePaiement = '';
      },
      error: (error) => {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      },
      complete: () => {
        this.processing = false;
      }
    });
  }

  generateQrCode(paiementId: number): void {
    this.paiementService.generateQrCode(paiementId).subscribe({
      next: (response: Blob) => {
        const objectUrl = URL.createObjectURL(response);
        this.qrCodeUrls[paiementId] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      },
      error: (error) => {
        console.error('QR code generation error:', error);
      }
    });
  }

  onPaymentSuccess(): void {
    this.consulterPaiements();
  }
}
