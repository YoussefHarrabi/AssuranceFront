import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceProType } from 'src/app/models/InsuranceProType';
import { InsuranceProTypeService } from '../../insuranceProTypeService/insurance-pro-type.service';

@Component({
  selector: 'app-insurance-pro-type',
  templateUrl: './insurance-pro-type.component.html',
  styleUrls: ['./insurance-pro-type.component.css'],
})
export class InsuranceProTypeComponent implements OnInit {
  insuranceProTypes: InsuranceProType[] = [];
  filteredInsuranceProTypes: InsuranceProType[] = [];
  paginatedInsuranceProTypes: InsuranceProType[] = [];
  searchName: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private service: InsuranceProTypeService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe((data) => {
      this.insuranceProTypes = data;
      this.filteredInsuranceProTypes = data;
      this.updatePagination();
    });
  }

  // Search by Name
  onSearch(): void {
    this.filteredInsuranceProTypes = this.insuranceProTypes.filter((type) =>
      type.field.toLowerCase().includes(this.searchName.toLowerCase())
    );
    this.currentPage = 1; // Reset to first page after search
    this.updatePagination();
  }

  // Pagination Logic
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInsuranceProTypes = this.filteredInsuranceProTypes.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInsuranceProTypes.length / this.itemsPerPage);
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
    this.router.navigate(['/backoffice/insurance-pro-type/add']);
  }

  edit(id?: number): void {
    if (id !== undefined) {
      this.router.navigate(['/backoffice/insurance-pro-type/add', id]);
    } else {
      console.error('Cannot edit: ID is undefined');
    }
  }

  delete(id: number): void {
    this.service.delete(id).subscribe(() => this.loadData());
  }
}