import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProFormComponent } from './insurance-pro-form.component';

describe('InsuranceProFormComponent', () => {
  let component: InsuranceProFormComponent;
  let fixture: ComponentFixture<InsuranceProFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceProFormComponent]
    });
    fixture = TestBed.createComponent(InsuranceProFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
