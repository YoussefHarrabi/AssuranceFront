import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Challenge } from '../../../Models/Loyalty/challenge.model';

@Component({
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.css']
})
export class ChallengeFormComponent implements OnInit {
  @Input() challenge: Challenge | null = null;
  @Output() formSubmit = new EventEmitter<Challenge>();
  @Output() formCancel = new EventEmitter<void>();

  challengeForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.challengeForm = this.fb.group({
      id: [this.challenge?.id || null],
      name: [this.challenge?.name || '', [Validators.required]],
      description: [this.challenge?.description || '', [Validators.required]],
      pointsAwarded: [this.challenge?.pointsAwarded || 0, [Validators.required, Validators.min(1)]],
      startDate: [this.formatDateForInput(this.challenge?.startDate), [Validators.required]],
      endDate: [this.formatDateForInput(this.challenge?.endDate)],
      isActive: [this.challenge?.isActive === undefined ? true : this.challenge.isActive]
    });
  }

  formatDateForInput(date: string | Date | undefined): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.challengeForm.valid) {
      const formValue = this.challengeForm.value;
      
      // Convert dates to proper format if needed
      if (formValue.startDate) {
        formValue.startDate = new Date(formValue.startDate);
      }
      
      if (formValue.endDate) {
        formValue.endDate = new Date(formValue.endDate);
      }
      
      this.formSubmit.emit(formValue);
    } else {
      this.markFormGroupTouched(this.challengeForm);
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