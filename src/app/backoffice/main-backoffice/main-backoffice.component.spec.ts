import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBackofficeComponent } from './main-backoffice.component';

describe('MainBackofficeComponent', () => {
  let component: MainBackofficeComponent;
  let fixture: ComponentFixture<MainBackofficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainBackofficeComponent]
    });
    fixture = TestBed.createComponent(MainBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
