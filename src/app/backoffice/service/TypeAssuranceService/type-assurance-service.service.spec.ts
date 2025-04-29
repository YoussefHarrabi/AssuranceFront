import { TestBed } from '@angular/core/testing';

import { TypeAssuranceService } from './type-assurance-service.service';

describe('TypeAssuranceServiceService', () => {
  let service: TypeAssuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeAssuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
