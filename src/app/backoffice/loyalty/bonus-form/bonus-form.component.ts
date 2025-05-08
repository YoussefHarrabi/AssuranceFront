import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bonus } from '../../../Models/Loyalty/bonus.model';

@Component({
  selector: 'app-bonus-form',
  templateUrl: './bonus-form.component.html',
  styleUrls: ['./bonus-form.component.css']
})
export class BonusFormComponent implements OnInit {
  @Input() bonus: Bonus | null = null;
  @Output() formSubmit = new EventEmitter<Bonus>();
  @Output() formCancel = new EventEmitter<void>();

  bonusForm!: FormGroup;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.setImagePreview();
  }

  initForm(): void {
    this.bonusForm = this.fb.group({
      id: [this.bonus?.id || null],
      name: [this.bonus?.name || '', [Validators.required]],
      description: [this.bonus?.description || '', [Validators.required]],
      pointsRequired: [this.bonus?.pointsRequired || 0, [Validators.required, Validators.min(1)]],
      imageUrl: [this.bonus?.imageUrl || ''],
      stock: [this.bonus?.stock || 1, [Validators.required, Validators.min(0)]],
      available: [this.bonus?.isAvailable === undefined ? true : this.bonus.isAvailable]
    });
  }

  setImagePreview(): void {
    this.imagePreview = this.bonus?.imageUrl || null;
    
    // Listen for changes to the imageUrl control
    this.bonusForm.get('imageUrl')?.valueChanges.subscribe(url => {
      this.imagePreview = url;
    });
  }

  onSubmit(): void {
    if (this.bonusForm.valid) {
      this.formSubmit.emit(this.bonusForm.value);
    } else {
      this.markFormGroupTouched(this.bonusForm);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}