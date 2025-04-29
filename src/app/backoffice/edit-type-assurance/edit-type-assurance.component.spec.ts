import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeAssuranceComponent } from './edit-type-assurance.component';

describe('EditTypeAssuranceComponent', () => {
  let component: EditTypeAssuranceComponent;
  let fixture: ComponentFixture<EditTypeAssuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTypeAssuranceComponent]
    });
    fixture = TestBed.createComponent(EditTypeAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
