import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComplaintResponseService } from 'src/app/complaint-response.service';
import { Response } from '../models/response.model';
import { QrCodeService } from 'src/app/qr-code.service';
import { DatePipe } from '@angular/common';
import { ComplaintStatus } from '../models/complaint-status.enum';

@Component({
  selector: 'app-response-detail',
  templateUrl: './response-detail.component.html',
  styleUrls: ['./response-detail.component.css'],
  providers: [DatePipe]
})
export class ResponseDetailComponent implements OnInit {
  response: Response | null = null;
  noResponseMessage: string | null = null;
  qrCodeUrl: string = '';

  isQrCodeLoading: boolean = true;

  

  constructor(
    private route: ActivatedRoute,
    private responseService: ComplaintResponseService,
    private qrCodeService: QrCodeService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.responseService.getResponseById(id).subscribe(
      data => {
        this.response = data;
        if (!this.response) {
          this.noResponseMessage = "Vous n'avez pas encore de réponse.";
        } else {
          this.generateQRCode();
        }
      },
      error => {
        console.error('Error fetching response details', error);
        this.noResponseMessage = "Vous n'avez pas encore de réponse.";
      }
    );
  }

  getStatusClass(status: ComplaintStatus | undefined): string {
    if (!status) return 'badge bg-secondary';
    
    const statusMap: { [key in ComplaintStatus]: string } = {
      [ComplaintStatus.PENDING]: 'badge bg-warning text-dark',
      [ComplaintStatus.IN_PROGRESS]: 'badge bg-info text-dark',
      [ComplaintStatus.RESOLVED]: 'badge bg-success'
    };

    return statusMap[status] || 'badge bg-secondary';
  }

  getStatusLabel(status: ComplaintStatus | undefined): string {
    if (!status) return 'Non défini';
    
    const statusLabels: { [key in ComplaintStatus]: string } = {
      [ComplaintStatus.PENDING]: 'En attente',
      [ComplaintStatus.IN_PROGRESS]: 'En cours',
      [ComplaintStatus.RESOLVED]: 'Résolu'
    };

    return statusLabels[status] || 'Non défini';
  }

  generateQRCode(): void {
    if (this.response) {
      const qrData = this.createQRCodeContent();
      this.qrCodeUrl = this.qrCodeService.generateQRCode(qrData);
      this.isQrCodeLoading = false;
    }
  }

  createQRCodeContent(): string {
    if (!this.response) return '';

    // Create a simplified version of the data for the QR code
    const qrData = {
      id: this.response.id,
      content: this.response.content,
      advisor: {
        name: `${this.response.advisor.firstName} ${this.response.advisor.lastName}`
      },
      date: this.datePipe.transform(this.response.date, 'dd/MM/yyyy HH:mm'),
      complaint: {
        id: this.response.complaint?.id,
        title: this.response.complaint?.title,
        status: this.getStatusLabel(this.response.complaint?.status)
      }
    };

    return JSON.stringify(qrData);
  }

  onQRCodeError(event: any): void {
    console.error('Error loading QR code:', event);
    this.isQrCodeLoading = false;
  }

  onQRCodeLoaded(): void {
    this.isQrCodeLoading = false;
  }

  downloadQRCode(): void {
    if (!this.qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = `reponse-${this.response?.id || 'inconnu'}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  copyLinkToClipboard(): void {
    const responseUrl = window.location.href;
    navigator.clipboard.writeText(responseUrl).then(() => {
      // Vous pourriez ajouter une notification toast ici
      console.log('URL copiée dans le presse-papiers');
    });
  }

  shareResponse(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Détails de la réponse - Assurance Maghrebia',
        text: `Réponse à la réclamation #${this.response?.id}`,
        url: window.location.href
      }).catch((error) => console.log('Erreur lors du partage', error));
    } else {
      this.copyLinkToClipboard();
    }
  }

  printToPDF(): void {
    const content = document.getElementById('print-section');
    if (!content) {
      console.error('Print section not found');
      return;
    }
  
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }
  
    const printContent = `
      <html>
        <head>
          <title>Réponse à la réclamation</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              line-height: 1.6;
            }
            .response-content {
              margin-bottom: 30px;
              border-left: 4px solid #0d6efd;
              padding-left: 20px;
            }
            .advisor-info {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .date {
              text-align: right;
              color: #666;
              margin-top: 30px;
            }
            h6 {
              color: #0d6efd;
              margin-bottom: 15px;
            }
            .badge {
              background-color: #0dcaf0;
              color: #000;
              padding: 5px 10px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="text-align: center; color: #0d6efd; margin-bottom: 30px;">
              Détails de la Réponse
            </h2>
            ${content.innerHTML}
          </div>
        </body>
      </html>
    `;
  
    printWindow.document.write(printContent);
    printWindow.document.close();
  
    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  }}