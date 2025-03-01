import { TestBed } from '@angular/core/testing';

import { ComplaintResponseService } from './complaint-response.service';

describe('ComplaintResponseService', () => {
  let service: ComplaintResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
