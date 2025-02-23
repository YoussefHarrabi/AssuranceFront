import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeSidebarComponent } from './backoffice-sidebar.component';

describe('BackofficeSidebarComponent', () => {
  let component: BackofficeSidebarComponent;
  let fixture: ComponentFixture<BackofficeSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackofficeSidebarComponent]
    });
    fixture = TestBed.createComponent(BackofficeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
