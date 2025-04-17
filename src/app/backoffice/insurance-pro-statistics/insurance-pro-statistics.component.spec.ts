import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProStatisticsComponent } from './insurance-pro-statistics.component';

describe('InsuranceProStatisticsComponent', () => {
  let component: InsuranceProStatisticsComponent;
  let fixture: ComponentFixture<InsuranceProStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceProStatisticsComponent]
    });
    fixture = TestBed.createComponent(InsuranceProStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
