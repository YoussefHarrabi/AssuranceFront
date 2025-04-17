import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceProTypeService } from '../../insuranceProTypeService/insurance-pro-type.service';
import { InsuranceProType } from 'src/app/models/InsuranceProType';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-insurance-pro-type-form',
  templateUrl: './insurance-pro-type-form.component.html',
  styleUrls: ['./insurance-pro-type-form.component.css']
})
export class InsuranceProTypeFormComponent {
  newInsuranceProType: InsuranceProType = { name: '', field: '', risk: '' };
  isEditMode: boolean = false;
  insuranceProTypeForm!: FormGroup;



  constructor(private fb:FormBuilder ,private service: InsuranceProTypeService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.insuranceProTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      field: ['', Validators.required],
      risk: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
    // Get ID from route parameters
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.service.getById(+id).subscribe(data => {
        this.newInsuranceProType = data; // Populate form with data
        console.log('Form populated with data:', data);
      });
    }
  });

  }

  save() {
    
    if (this.newInsuranceProType.id) {
      // Update existing record
      this.service.update(this.newInsuranceProType).subscribe(() => {
        console.log('Updated successfully');
        this.router.navigate(['/backoffice/insurance-pro-type']);

      });
    } else {
      // Create new record
      this.service.create(this.newInsuranceProType).subscribe(() => {
        console.log('Created successfully');
        this.router.navigate(['/backoffice/insurance-pro-type']);

      });
    }
  }
}
