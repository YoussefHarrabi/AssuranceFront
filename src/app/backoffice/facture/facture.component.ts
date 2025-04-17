import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FactureService } from '../service/Facture/facture.service';
import { Facture } from '.././models/facture';
import { FactureStatut } from '../Enums/FactureStatut.enum';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/backoffice/models/User';
import { UserService } from '../service/User/user.service';


@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css'],
})
export class FactureComponent implements OnInit {
  factures: Facture[] = [];
  filteredFactures: Facture[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchControl = new FormControl('');
  p: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'éléments par page

  FactureStatut = FactureStatut; // Ajouter cette ligne pour rendre FactureStatut disponible dans le template
  isEmailSending: { [key: number]: boolean } = {};


  constructor(private factureService: FactureService, private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadFactures();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterFactures(searchTerm || '');
    });
  }

  filterFactures(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredFactures = [...this.factures];
      return;
    }

    this.filteredFactures = this.factures.filter(facture => {
      const fullName = `${facture.user?.firstName} ${facture.user?.lastName}`.toLowerCase();
      const startsWith = (str: string, term: string) => str.startsWith(term);

      return startsWith(facture.user?.firstName?.toLowerCase() || '', searchTerm) ||
             startsWith(facture.user?.lastName?.toLowerCase() || '', searchTerm) ||
             facture.factureId.toString().includes(searchTerm) ||
             facture.montant.toString().includes(searchTerm) ||
             facture.dateEmission.toString().toLowerCase().includes(searchTerm) ||
             facture.factureStatut.toLowerCase().includes(searchTerm) ||
             fullName.includes(searchTerm);
    });
  }

  loadFactures(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.factureService.getAllFactures().subscribe({
      next: (data) => {
        console.log('📜 Factures reçues:', data);
        this.factures = data;
        this.filteredFactures = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des factures:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement des factures.';
        this.isLoading = false;
      },
    });
  }

  getNomClient(facture: Facture): string {
    if (facture.user?.firstName && facture.user?.lastName) {
      return `${facture.user.firstName} ${facture.user.lastName}`;
    }
    return 'Client non défini';
  }

  onUpdate(facture: Facture): void {
    this.router.navigate(['/backoffice/facture/update', facture.factureId]);
  }

  onDelete(factureId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.isLoading = true;
      this.factureService.deleteFacture(factureId).subscribe({
        next: () => {
          console.log(`✅ Facture supprimée: ${factureId}`);
          this.factures = this.factures.filter((f) => f.factureId !== factureId);
          this.filteredFactures = this.filteredFactures.filter((f) => f.factureId !== factureId);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression de la facture.';
          this.isLoading = false;
        },
      });
    }
  }

  onAddFacture(): void {
    this.router.navigate(['/backoffice/facture/add']).then(
      () => console.log('Navigation vers le formulaire d\'ajout réussie'),
      error => console.error('Erreur de navigation:', error)
    );
  }

  downloadFacturePdf(factureId: number): void {
    this.factureService.downloadFacturePdf(factureId).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${factureId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  sendEmail(facture: Facture): void {
    if (!facture.factureId || !facture.user) {
      this.showNotification('Informations de facture invalides', 'error');
      return;
    }

    this.isEmailSending[facture.factureId] = true;

    this.factureService.sendFactureEmail(facture.factureId).subscribe({
      next: (response) => {
        const clientName = `${facture.user!.firstName} ${facture.user!.lastName}`;
        this.showNotification(
          `Email envoyé avec succès à ${clientName} (${facture.user!.email})`,
          'success'
        );
        this.isEmailSending[facture.factureId] = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        this.showNotification(
          'Erreur lors de l\'envoi de l\'email',
          'error'
        );
        this.isEmailSending[facture.factureId] = false;
      }
    });
  }

private showNotification(message: string, type: 'success' | 'error'): void {
    const config = {
        duration: 3000,
        horizontalPosition: 'end' as const,
        verticalPosition: 'top' as const,
        panelClass: type === 'success' ? ['bg-success'] : ['bg-danger']
    };

    this.snackBar.open(message, 'Fermer', config);
}

}
