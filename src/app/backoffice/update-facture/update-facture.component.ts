import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../service/Facture/facture.service';
import { UserService } from '../service/User/user.service';
import { Facture } from '../models/facture';
import { User } from '../models/User';

@Component({
  selector: 'app-update-facture',
  templateUrl: './update-facture.component.html',
  styleUrls: ['./update-facture.component.css']
})
export class UpdateFactureComponent implements OnInit {
  factureForm: FormGroup;
  users: User[] = [];
  facture: Facture | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  factureId: number;

  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.factureId = +this.route.snapshot.params['id'];
    this.factureForm = this.fb.group({
      userId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      dateEmission: ['', Validators.required],
      factureStatut: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadFacture();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('👥 Utilisateurs chargés:', users);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des utilisateurs:', error);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
      }
    });
  }

  loadFacture(): void {
    this.isLoading = true;
    this.factureService.getFactureById(this.factureId).subscribe({
      next: (facture) => {
        this.facture = facture;
        this.factureForm.patchValue({
          userId: facture.user?.id,
          montant: facture.montant,
          dateEmission: facture.dateEmission,
          factureStatut: facture.factureStatut
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement de la facture:', error);
        this.errorMessage = 'Erreur lors du chargement de la facture.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.factureForm.valid && this.facture) {
      // Trouver l'utilisateur sélectionné pour obtenir ses informations complètes
      const selectedUser = this.users.find(user => user.id === this.factureForm.value.userId);

      const updatedFacture: Facture = {
        ...this.facture,
        montant: this.factureForm.value.montant,
        dateEmission: this.factureForm.value.dateEmission,
        factureStatut: this.factureForm.value.factureStatut,
        user: {
          id: this.factureForm.value.userId,
          firstName: selectedUser?.firstName || '',
          lastName: selectedUser?.lastName || '',
          email: selectedUser?.email || ''  // Ajout de l'email
        }
      };

      this.isLoading = true;
      this.factureService.updateFacture(updatedFacture).subscribe({
        next: () => {
          console.log('✅ Facture mise à jour avec succès');
          this.router.navigate(['/backoffice/facture']);
        },
        error: (error) => {
          console.error('❌ Erreur lors de la mise à jour:', error);
          this.errorMessage = 'Erreur lors de la mise à jour de la facture.';
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/backoffice/facture']);
  }
}
