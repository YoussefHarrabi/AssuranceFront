import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProTypeFormComponent } from './insurance-pro-type-form.component';

describe('InsuranceProTypeFormComponent', () => {
  let component: InsuranceProTypeFormComponent;
  let fixture: ComponentFixture<InsuranceProTypeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceProTypeFormComponent]
    });
    fixture = TestBed.createComponent(InsuranceProTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
