import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintResponseComponent } from './complaint-response.component';

describe('ComplaintResponseComponent', () => {
  let component: ComplaintResponseComponent;
  let fixture: ComponentFixture<ComplaintResponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintResponseComponent]
    });
    fixture = TestBed.createComponent(ComplaintResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
