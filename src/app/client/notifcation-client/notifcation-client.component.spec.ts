import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifcationClientComponent } from './notifcation-client.component';

describe('NotifcationClientComponent', () => {
  let component: NotifcationClientComponent;
  let fixture: ComponentFixture<NotifcationClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotifcationClientComponent]
    });
    fixture = TestBed.createComponent(NotifcationClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
