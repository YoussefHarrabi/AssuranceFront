import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceParticulierComponent } from './assurance-particulier.component';

describe('AssuranceParticulierComponent', () => {
  let component: AssuranceParticulierComponent;
  let fixture: ComponentFixture<AssuranceParticulierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceParticulierComponent]
    });
    fixture = TestBed.createComponent(AssuranceParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
