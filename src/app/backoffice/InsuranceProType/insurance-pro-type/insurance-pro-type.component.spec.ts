import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProTypeComponent } from './insurance-pro-type.component';

describe('InsuranceProTypeComponent', () => {
  let component: InsuranceProTypeComponent;
  let fixture: ComponentFixture<InsuranceProTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceProTypeComponent]
    });
    fixture = TestBed.createComponent(InsuranceProTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
