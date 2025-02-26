import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferListFrontComponent } from './job-offer-list-front.component';

describe('JobOfferListFrontComponent', () => {
  let component: JobOfferListFrontComponent;
  let fixture: ComponentFixture<JobOfferListFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOfferListFrontComponent]
    });
    fixture = TestBed.createComponent(JobOfferListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
