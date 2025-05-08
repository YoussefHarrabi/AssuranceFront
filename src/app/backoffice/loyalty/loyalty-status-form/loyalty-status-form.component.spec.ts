import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyStatusFormComponent } from './loyalty-status-form.component';

describe('LoyaltyStatusFormComponent', () => {
  let component: LoyaltyStatusFormComponent;
  let fixture: ComponentFixture<LoyaltyStatusFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoyaltyStatusFormComponent]
    });
    fixture = TestBed.createComponent(LoyaltyStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
