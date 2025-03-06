import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeUnauthorizedComponent } from './backoffice-unauthorized.component';

describe('BackofficeUnauthorizedComponent', () => {
  let component: BackofficeUnauthorizedComponent;
  let fixture: ComponentFixture<BackofficeUnauthorizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackofficeUnauthorizedComponent]
    });
    fixture = TestBed.createComponent(BackofficeUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
