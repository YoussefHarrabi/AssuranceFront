import { Component, OnInit } from '@angular/core';
import { TypeAssuranceParticular } from '../models/type-assurance-particular.modelV';
import { TypeAssuranceService } from '../service/TypeAssuranceService/type-assurance-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-type-assurance',
  templateUrl: './list-type-assurance.component.html',
  styleUrls: ['./list-type-assurance.component.css']
})
export class ListTypeAssuranceComponent implements OnInit {
  typesAssurance: TypeAssuranceParticular[] = [];
  filteredTypes: TypeAssuranceParticular[] = [];
  searchTerm: string = '';
  sortBy: string = 'id';
  deleteId: number | null = null;

  // Variables de pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private typeAssuranceService: TypeAssuranceService) {}

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(): void {
    this.typeAssuranceService.getAllTypes().subscribe(
      (data) => {
        console.log('Données reçues :', data);
        this.typesAssurance = data;
        this.applyFilter();
      },
      (error) => {
        console.error('Erreur lors du chargement :', error);
      }
    );
  }

  applyFilter(): void {
    const filtered = this.typesAssurance
      .filter((type) =>
        type.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        this.sortBy === 'nom' ? a.nom.localeCompare(b.nom) : a.id! - b.id!
      );

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredTypes = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  setDeleteId(id: number): void {
    this.deleteId = id;
  }

  confirmDelete(): void {
    if (this.deleteId !== null) {
      this.typeAssuranceService.deleteTypeAssurance(this.deleteId).subscribe(
        () => {
          // Remove the deleted item from the list
          this.typesAssurance = this.typesAssurance.filter(type => type.id !== this.deleteId);
          this.applyFilter(); // Reapply filter to update the list after deletion
          this.deleteId = null; // Reset deleteId
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la suppression : ', error);
        }
      );
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilter();
    }
  }
}
