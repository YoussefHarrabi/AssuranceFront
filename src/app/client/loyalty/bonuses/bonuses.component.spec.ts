import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusesComponent } from './bonuses.component';

describe('BonusesComponent', () => {
  let component: BonusesComponent;
  let fixture: ComponentFixture<BonusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusesComponent]
    });
    fixture = TestBed.createComponent(BonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
