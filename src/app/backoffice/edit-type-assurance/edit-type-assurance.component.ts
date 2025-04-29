import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeAssuranceService } from '../service/TypeAssuranceService/type-assurance-service.service';


@Component({
  selector: 'app-edit-type-assurance',
  templateUrl: './edit-type-assurance.component.html'
})
export class EditTypeAssuranceComponent implements OnInit {
  typeForm: FormGroup;
  id?: number;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private typeAssuranceService: TypeAssuranceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.typeForm = this.fb.group({
      nom: [
        '', 
        [
          Validators.required, // Champ obligatoire
          Validators.pattern('^[a-zA-ZÀ-ÿ ]+$') // Accepter uniquement les lettres (y compris accents et espaces)
        ]
      ],
      attributes: ['']
    });
    
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.typeAssuranceService.getTypeById(this.id).subscribe(
        (type) => {
          this.typeForm.patchValue(type);
        },
        (error) => {
          this.errorMessage = "Erreur lors du chargement des données.";
          console.error(error);
        }
      );
    }
  }

  save(): void {
    const typeAssurance = this.typeForm.value;

    if (this.id) {
      this.typeAssuranceService.updateType(this.id, typeAssurance).subscribe(
        () => {
          alert('Type d\'assurance mis à jour avec succès !');
          this.router.navigate(['../../types'], { relativeTo: this.route });
        },
        (error) => {
          this.errorMessage = "Erreur lors de la mise à jour.";
          console.error(error);
        }
      );
    } else {
      this.typeAssuranceService.addType(typeAssurance).subscribe(
        () => {
          alert('Type d\'assurance ajouté avec succès !');
          this.router.navigate(['../types'], { relativeTo: this.route });
        },
        (error) => {
          this.errorMessage = "Erreur lors de l\'ajout.";
          console.error(error);
        }
      );
    }
  }
}
