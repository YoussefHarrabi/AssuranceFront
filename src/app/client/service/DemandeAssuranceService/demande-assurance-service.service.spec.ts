import { TestBed } from '@angular/core/testing';

import { DemandeAssuranceService } from './demande-assurance-service.service';

describe('DemandeAssuranceServiceService', () => {
  let service: DemandeAssuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeAssuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
