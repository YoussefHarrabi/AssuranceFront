import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeNavbarComponent } from './backoffice-navbar.component';

describe('BackofficeNavbarComponent', () => {
  let component: BackofficeNavbarComponent;
  let fixture: ComponentFixture<BackofficeNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackofficeNavbarComponent]
    });
    fixture = TestBed.createComponent(BackofficeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
