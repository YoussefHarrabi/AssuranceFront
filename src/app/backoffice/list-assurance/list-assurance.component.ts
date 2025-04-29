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
  page: number = 1;  // Current page
  itemsPerPage: number = 5;  // Items per page

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

  deleteDemande(id: number | undefined): void {
    if (!id) {
      alert("ID invalide pour la suppression !");
      return;
    }
    if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
      this.demandeService.deleteDemande(id).subscribe(
        () => {
          alert("Demande supprimée avec succès !");
          this.getDemandes();  // Refresh the list
        },
        (error) => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression !");
        }
      );
    }
  }
  
  updateStatus(id: number, newStatus: string): void {
    const emailClient = 'kaledgadh0@gmail.com';  // Replace this with the real client email
  
    // Log to confirm the status update
    console.log(`Updating status for demande ${id} to ${newStatus} for email ${emailClient}`);
    
    this.demandeService.updateStatus(id, newStatus, emailClient).subscribe(
      (data) => {
        alert("Statut mis à jour avec succès !");
        this.getDemandes();  // Reload the demandes after status update
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du statut !", error);
        alert("Erreur lors de la mise à jour du statut !");
      }
    );
  }
  
  
}
