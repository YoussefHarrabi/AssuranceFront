import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsurancePro, InsuranceStatus } from 'src/app/models/InsurancePro';
import { InsuranceProType } from 'src/app/models/InsuranceProType';
import { InsuranceProService } from '../../insuranceProService/insurance-pro.service';
import { InsuranceProTypeService } from 'src/app/backoffice/insuranceProTypeService/insurance-pro-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-insurance-pro-form',
  templateUrl: './insurance-pro-form.component.html',
  styleUrls: ['./insurance-pro-form.component.css']
})
export class InsuranceProFormComponent {
  insuranceProForm!: FormGroup;
  newInsurancePro: InsurancePro = {
    proName: '',
    description: '',
    premiumAmount: 0,
    insuranceProType: { id: 0, name: '', field: '', risk: '' },
    status: InsuranceStatus.EN_ATTENTE,
    fichier: null
  };
  isEditMode: boolean = false;

  insuranceProTypes: InsuranceProType[] = [];

  constructor(
    private service: InsuranceProService,
    private typeService: InsuranceProTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.insuranceProForm = this.fb.group({
      proName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      premiumAmount: [0, [Validators.required, Validators.min(1)]],
      insuranceProType: ['', [Validators.required]],
      fichier: [null] // Add this for file upload handling
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.service.getById(+id).subscribe(data => {
          this.newInsurancePro = data;
          this.insuranceProForm.patchValue({
            proName: this.newInsurancePro.proName,
            description: this.newInsurancePro.description,
            premiumAmount: this.newInsurancePro.premiumAmount,
            insuranceProType: this.newInsurancePro.insuranceProType.id
          });
        });
      }
    });

    this.typeService.getAll().subscribe(data => {
      this.insuranceProTypes = data;
    });
  }
  save(): void {
    console.log('Form data:', this.insuranceProForm.value);
    
    // Create FormData
    const formData = new FormData();
    formData.append('proName', this.newInsurancePro.proName);
    formData.append('description', this.newInsurancePro.description);
    formData.append('premiumAmount', this.newInsurancePro.premiumAmount.toString());
    
    if (this.newInsurancePro.insuranceProType?.id !== undefined) {
      formData.append('insuranceProType', this.newInsurancePro.insuranceProType.id.toString());
    } else {
      console.error('Insurance Pro Type is undefined or missing ID');
    }
    
    formData.append('status', this.newInsurancePro.status);
  
    if (this.newInsurancePro.fichier) {
      formData.append('fichier', this.newInsurancePro.fichier);
    } else {
      console.error('File is missing!');
    }
  
    console.log('FormData:', formData); // Debug the FormData content
  
    if (this.isEditMode && this.newInsurancePro.id) {
      // Update with file
      this.service.updateInsurancePro(this.newInsurancePro).subscribe({
        next: (response) => {
          console.log('Update with file successful', response);
          this.router.navigate(['/client/insurance-pro']);
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Create new with file
      this.service.createInsurancePro(this.newInsurancePro).subscribe({
        next: (response) => {
          console.log('Create successful', response);
          this.router.navigate(['/client/insurance-pro']);
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }
  
  onInsuranceProTypeChange(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedType = this.insuranceProTypes.find(type => type.id === +selectedId);
    if (selectedType) {
      this.newInsurancePro.insuranceProType = selectedType;
      this.newInsurancePro.status = InsuranceStatus.EN_ATTENTE;
      this.newInsurancePro.fichier = null; // Reset file if type changes
    }
    this.service.setPrice(this.newInsurancePro).subscribe({
      next: (response) => {
        this.newInsurancePro = response;
        this.insuranceProForm.patchValue({
          premiumAmount: this.newInsurancePro.premiumAmount
        });
    },
    error: (err) => console.error('Set price failed', err)
  });
    
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.newInsurancePro.fichier = file; // Set file to be uploaded
    }
  }
}
