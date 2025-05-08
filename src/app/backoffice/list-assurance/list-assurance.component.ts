import { Component, OnInit } from '@angular/core';
import { AssuranceParticular } from 'src/app/client/models/assurance-particular.modelV';
import { DemandeAssuranceService } from 'src/app/client/service/DemandeAssuranceService/demande-assurance-service.service';

@Component({
  selector: 'app-list-assurance',
  templateUrl: './list-assurance.component.html',
  styleUrls: ['./list-assurance.component.css']
})
export class ListAssuranceComponent implements OnInit {
  demandes: AssuranceParticular[] = [];
  selectedStatuses: string[] = [];
  allStatuses = ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'];

  page: number = 1;
  itemsPerPage: number = 5;

  constructor(private demandeService: DemandeAssuranceService) {}

  ngOnInit(): void {
    this.getDemandes();
  }

  getDemandes(): void {
    this.demandeService.getAllDemandes().subscribe(
      (data) => {
        this.demandes = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
      }
    );
  }

  get filteredDemandes(): AssuranceParticular[] {
    if (this.selectedStatuses.length === 0) return this.demandes;
    return this.demandes.filter(d => this.selectedStatuses.includes(d.status!));
  }

  toggleStatusFilter(status: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }
  }

  resetFilters(): void {
    this.selectedStatuses = [];
  }

  deleteDemande(id: number | undefined): void {
    if (!id) return;
    if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
      this.demandeService.deleteDemande(id).subscribe(
        () => {
          alert("Demande supprimée avec succès !");
          this.getDemandes();
        },
        (error) => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression !");
        }
      );
    }
  }

  updateStatus(id: number, newStatus: string): void {
    const emailClient = 'kaledgadh0@gmail.com'; // Replace with real email
    this.demandeService.updateStatus(id, newStatus, emailClient).subscribe(
      () => {
        alert("Statut mis à jour avec succès !");
        this.getDemandes();
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du statut !", error);
        alert("Erreur lors de la mise à jour du statut !");
      }
    );
  }
}
