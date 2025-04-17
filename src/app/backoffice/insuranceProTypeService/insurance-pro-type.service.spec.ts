import { TestBed } from '@angular/core/testing';
import { InsuranceProTypeService } from './insurance-pro-type.service';


describe('InsuranceProTypeService', () => {
  let service: InsuranceProTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceProTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
