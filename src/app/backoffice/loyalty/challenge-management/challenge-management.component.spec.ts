import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeManagementComponent } from './challenge-management.component';

describe('ChallengeManagementComponent', () => {
  let component: ChallengeManagementComponent;
  let fixture: ComponentFixture<ChallengeManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeManagementComponent]
    });
    fixture = TestBed.createComponent(ChallengeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
