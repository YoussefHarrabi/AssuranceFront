import { TestBed } from '@angular/core/testing';
import { InsuranceProService } from './insurance-pro.service';


describe('InsuranceProService', () => {
  let service: InsuranceProService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceProService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
