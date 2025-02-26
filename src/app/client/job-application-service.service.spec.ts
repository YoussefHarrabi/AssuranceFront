import { TestBed } from '@angular/core/testing';

import { JobApplicationServiceService } from './job-application-service.service';

describe('JobApplicationServiceService', () => {
  let service: JobApplicationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobApplicationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
