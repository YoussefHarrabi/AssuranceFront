import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsurancePro, InsuranceStatus } from 'src/app/models/InsurancePro';
import { InsuranceProService } from '../../insuranceProService/insurance-pro.service';
import { MatDialog } from '@angular/material/dialog';
import { InsuranceDialogComponent } from '../insurance-dialog/insurance-dialog.component';

@Component({
  selector: 'app-insurance-pro',
  templateUrl: './insurance-pro.component.html',
  styleUrls: ['./insurance-pro.component.css'],
})
export class InsuranceProComponent implements OnInit {
  insurancePros: InsurancePro[] = []; // all from backend
  filteredInsurancePros: InsurancePro[] = []; // after filtering by search + status
  paginatedInsurancePros: InsurancePro[] = [];

  searchType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;

  insuranceStatuses = Object.values(InsuranceStatus);
  selectedStatuses: InsuranceStatus[] = [];

  constructor(
    private service: InsuranceProService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe((data) => {
      this.insurancePros = data;
      this.applyFilters();
    });
  }

  // Filtering based on selected statuses
  onStatusFilterChange(event: any): void {
    const status = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }

    this.applyFilters();
  }

  // Filtering based on search + status together
  applyFilters(): void {
    let result = [...this.insurancePros];

    if (this.selectedStatuses.length > 0) {
      result = result.filter(pro =>
        this.selectedStatuses.includes(pro.status)
      );
    }

    if (this.searchType.trim()) {
      result = result.filter(pro =>
        pro.insuranceProType.name.toLowerCase().includes(this.searchType.toLowerCase())
      );
    }

    this.filteredInsurancePros = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch(): void {
    this.applyFilters();
  }

  // Pagination Logic
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInsurancePros = this.filteredInsurancePros.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInsurancePros.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // Navigation
  goToAddForm(): void {
    this.router.navigate(['/client/insurance-pro/add']);
  }

  edit(id: number): void {
    if (id !== undefined) {
      this.router.navigate(['/client/insurance-pro/add', id]);
    } else {
      console.error('Cannot edit: ID is undefined');
    }
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this insurance pro?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  // Dialog View
  viewDetails(pro: InsurancePro): void {
    const dialogRef = this.dialog.open(InsuranceDialogComponent, {
      width: '800px',
      data: { insurance: pro }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData(); // refresh data after dialog actions
      if (result?.deleted || result) {
        this.loadData(); // refresh data after dialog actions
      }
    });
  }
}
