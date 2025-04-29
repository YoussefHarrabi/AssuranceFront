import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeAssuranceService } from '../service/DemandeAssuranceService/demande-assurance-service.service';
import { TypeAssuranceService } from 'src/app/backoffice/service/TypeAssuranceService/type-assurance-service.service';

@Component({
  selector: 'app-assurance-particulier',
  templateUrl: './assurance-particulier.component.html',
  styleUrls: ['./assurance-particulier.component.css']
})
export class AssuranceParticulierComponent implements OnInit {
  demandeForm!: FormGroup;
  id: number | null = null;
  typesAssurance: any[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeAssuranceService,
    private typeAssuranceService: TypeAssuranceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.demandeForm = this.fb.group({
      nomAssurance: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9!:\-,;_ ]+$/)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9!:\-,;_ ]+$/)]],
      prix: ['', [Validators.required, Validators.min(0)]],
      typeAssurance: ['', Validators.required],
      status: ['EN_ATTENTE'] // ✅ Champ "status" ajouté ici
    });

    this.loadTypesAssurance();

    const paramId = this.route.snapshot.params['id'];
    this.id = paramId ? parseInt(paramId, 10) : null;

    if (this.id) {
      this.loadDemande();
    }
  }

  loadTypesAssurance(): void {
    this.typeAssuranceService.getAllTypes().subscribe(
      (data) => {
        this.typesAssurance = data;
      },
      (error) => {
        this.errorMessage = "Erreur lors du chargement des types d'assurance.";
        console.error(error);
      }
    );
  }

  loadDemande(): void {
    this.demandeService.getDemandeById(this.id!).subscribe(
      (data) => {
        this.typeAssuranceService.getAllTypes().subscribe(
          (types) => {
            this.typesAssurance = types;
            const selectedType = this.typesAssurance.find(t => t.id === data.typeAssurance.id);
            data.typeAssurance = selectedType || null;
            this.demandeForm.patchValue(data);
          },
          (error) => {
            console.error("Erreur lors du chargement des types d'assurance:", error);
          }
        );
      },
      (error) => {
        this.errorMessage = "Erreur lors du chargement de la demande.";
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.demandeForm.invalid) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    let demandeData = this.demandeForm.value;
    demandeData.prix = parseFloat(demandeData.prix);

    if (!demandeData.typeAssurance) {
      alert("Veuillez sélectionner un type d'assurance !");
      return;
    }

    demandeData.typeAssurance = { id: demandeData.typeAssurance.id };

    // ✅ Définit le statut à "EN_ATTENTE" si non défini
    if (!demandeData.status) {
      demandeData.status = 'EN_ATTENTE';
    }

    console.log("🚀 Données envoyées :", demandeData);

    if (this.id) {
      this.updateDemande(demandeData);
    } else {
      this.createDemande(demandeData);
    }
  }
  goToListAssurance(): void {
    this.router.navigate(['../client/List']);
  }
  createDemande(demandeData: any): void {
    this.demandeService.addDemande(demandeData).subscribe(
      () => {
        alert("Demande d'assurance ajoutée avec succès !");
        this.goToListAssurance();
       
      },
      (error) => {
        this.errorMessage = "Erreur lors de l'ajout de la demande.";
        console.error(error);
      }
    );
  }

  updateDemande(demandeData: any): void {
    this.demandeService.updateDemande(this.id!, demandeData).subscribe(
      () => {
        alert("Demande d'assurance mise à jour avec succès !");
        this.router.navigate(['/List']);
      },
      (error) => {
        this.errorMessage = "Erreur lors de la mise à jour de la demande.";
        console.error(error);
      }
    );
  }


  
}
