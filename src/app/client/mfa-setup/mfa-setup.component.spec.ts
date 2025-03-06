import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaSetupComponent } from './mfa-setup.component';

describe('MfaSetupComponent', () => {
  let component: MfaSetupComponent;
  let fixture: ComponentFixture<MfaSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MfaSetupComponent]
    });
    fixture = TestBed.createComponent(MfaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
