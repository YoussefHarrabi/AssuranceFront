import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDialogComponent } from './insurance-dialog.component';

describe('InsuranceDialogComponent', () => {
  let component: InsuranceDialogComponent;
  let fixture: ComponentFixture<InsuranceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceDialogComponent]
    });
    fixture = TestBed.createComponent(InsuranceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
