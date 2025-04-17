import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/User/user.service';
import { FactureService } from '../service/Facture/facture.service';
import { User } from '../models/User';
import { Facture } from '../models/facture';

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.css']
})
export class AddFactureComponent implements OnInit {
  factureForm: FormGroup;
  users: User[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private factureService: FactureService,
    private router: Router
  ) {
    this.factureForm = this.fb.group({
      userId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      dateEmission: [new Date().toISOString().split('T')[0], Validators.required],
      factureStatut: ['EN_ATTENTE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('👥 Utilisateurs chargés:', users);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des utilisateurs:', error);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.factureForm.valid) {
      const selectedUser = this.users.find(user => user.id === this.factureForm.value.userId);

      const newFacture: Facture = {
        factureId: 0, // sera généré par le backend
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
      this.factureService.addFacture(newFacture).subscribe({
        next: () => {
          console.log('✅ Facture ajoutée avec succès');
          this.router.navigate(['/backoffice/facture']);
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout:', error);
          this.errorMessage = 'Erreur lors de l\'ajout de la facture.';
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/facture']);
  }
}
