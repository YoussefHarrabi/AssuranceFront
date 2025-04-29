import { Component, OnInit } from '@angular/core';
import { DemandeAssuranceService } from '../service/DemandeAssuranceService/demande-assurance-service.service'; 
import { AssuranceParticular } from '../models/assurance-particular.modelV'; 

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  demandes: AssuranceParticular[] = [];
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

  deleteDemande(id: number | undefined): void {
    if (!id) {
      alert("ID invalide pour la suppression !");
      return;
    }
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


}
