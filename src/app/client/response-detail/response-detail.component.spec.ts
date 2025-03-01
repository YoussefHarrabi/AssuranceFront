import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDetailComponent } from './response-detail.component';

describe('ResponseDetailComponent', () => {
  let component: ResponseDetailComponent;
  let fixture: ComponentFixture<ResponseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponseDetailComponent]
    });
    fixture = TestBed.createComponent(ResponseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
