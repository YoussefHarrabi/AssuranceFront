import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAssuranceStatisticsComponent } from './type-assurance-statistics.component';

describe('TypeAssuranceStatisticsComponent', () => {
  let component: TypeAssuranceStatisticsComponent;
  let fixture: ComponentFixture<TypeAssuranceStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeAssuranceStatisticsComponent]
    });
    fixture = TestBed.createComponent(TypeAssuranceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
