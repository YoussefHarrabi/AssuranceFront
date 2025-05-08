import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyStatusManagementComponent } from './loyalty-status-management.component';

describe('LoyaltyStatusManagementComponent', () => {
  let component: LoyaltyStatusManagementComponent;
  let fixture: ComponentFixture<LoyaltyStatusManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoyaltyStatusManagementComponent]
    });
    fixture = TestBed.createComponent(LoyaltyStatusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
