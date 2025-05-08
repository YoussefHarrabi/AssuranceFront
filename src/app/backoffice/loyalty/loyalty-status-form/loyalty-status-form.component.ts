import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoyaltyStatus } from '../../../Models/Loyalty/loyalty-status.model';

@Component({
  selector: 'app-loyalty-status-form',
  templateUrl: './loyalty-status-form.component.html',
  styleUrls: ['./loyalty-status-form.component.css']
})
export class LoyaltyStatusFormComponent implements OnInit {
  @Input() status: LoyaltyStatus | null = null;
  @Output() formSubmit = new EventEmitter<LoyaltyStatus>();
  @Output() formCancel = new EventEmitter<void>();

  statusForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.statusForm = this.fb.group({
      id: [this.status?.id || null],
      tier: [this.status?.tier || '', [Validators.required]],
      description: [this.status?.description || '', [Validators.required]],
      pointsThreshold: [this.status?.pointsThreshold || 0, [Validators.required, Validators.min(0)]],
      benefits: [this.status?.benefits || '', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.statusForm.valid) {
      this.formSubmit.emit(this.statusForm.value);
    } else {
      this.markFormGroupTouched(this.statusForm);
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