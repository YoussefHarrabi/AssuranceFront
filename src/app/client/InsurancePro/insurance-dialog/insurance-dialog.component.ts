import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InsurancePro, InsuranceStatus } from 'src/app/models/InsurancePro';
import { InsuranceProService } from '../../insuranceProService/insurance-pro.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-insurance-dialog',
  templateUrl: './insurance-dialog.component.html',
  styleUrls: ['./insurance-dialog.component.css']
})
export class InsuranceDialogComponent {

  insurance: InsurancePro;
  pdfSrc: any;
  changedInsurances: InsurancePro[] = [];
  InsuranceStatus = InsuranceStatus; // Make enum available in template

  constructor(
    public dialogRef: MatDialogRef<InsuranceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private insuranceService: InsuranceProService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.insurance = { ...data.insurance };
  }

  ngOnInit(): void {
    this.loadPdf();
  }

  
  loadPdf(): void {
    if (this.insurance.id) {
      this.insuranceService.getInsuranceFile(this.insurance.id).subscribe(
        (data: Blob) => {
          const fileURL = URL.createObjectURL(data);
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error loading PDF:', error);
        }
      );
    }
  }

  changeStatus(newStatus: InsuranceStatus): void {
    this.insuranceService.changeInsuranceStatus(this.insurance.id!, newStatus).subscribe(
      (data: InsurancePro) => {
        this.changedInsurances.push(data);
        this.insurance.status = newStatus;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error updating status:', error);
      }
    );
  }

  /*  deleteInsurance(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this insurance?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.insuranceService.delete(this.insurance.id!).subscribe(
          () => {
            this.dialogRef.close({ deleted: true });
          },
          error => {
            console.error('Error deleting insurance:', error);
          }
        );
      }
    });
  } */

  onClose(): void {
    this.dialogRef.close(this.changedInsurances);
  }
}

