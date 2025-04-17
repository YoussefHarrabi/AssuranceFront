import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  generateQRCode(data: string): string {
    // Utilisation de l'API QR Server pour générer le QR code
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const size = '300x300';
    const encoding = 'UTF-8';
    
    // Construction de l'URL avec les paramètres
    return `${baseUrl}?data=${encodeURIComponent(data)}&size=${size}&charset-source=${encoding}&margin=10`;
  }
}