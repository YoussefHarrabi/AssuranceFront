import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProComponent } from './insurance-pro.component';

describe('InsuranceProComponent', () => {
  let component: InsuranceProComponent;
  let fixture: ComponentFixture<InsuranceProComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceProComponent]
    });
    fixture = TestBed.createComponent(InsuranceProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
