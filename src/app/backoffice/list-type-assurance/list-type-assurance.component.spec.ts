import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeAssuranceComponent } from './list-type-assurance.component';

describe('ListTypeAssuranceComponent', () => {
  let component: ListTypeAssuranceComponent;
  let fixture: ComponentFixture<ListTypeAssuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTypeAssuranceComponent]
    });
    fixture = TestBed.createComponent(ListTypeAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
