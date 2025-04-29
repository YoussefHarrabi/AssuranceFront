import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceDetailComponent } from './assurance-detail.component';

describe('AssuranceDetailComponent', () => {
  let component: AssuranceDetailComponent;
  let fixture: ComponentFixture<AssuranceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceDetailComponent]
    });
    fixture = TestBed.createComponent(AssuranceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
