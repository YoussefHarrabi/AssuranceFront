import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFooterComponent } from './backoffice-footer.component';

describe('BackofficeFooterComponent', () => {
  let component: BackofficeFooterComponent;
  let fixture: ComponentFixture<BackofficeFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackofficeFooterComponent]
    });
    fixture = TestBed.createComponent(BackofficeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
