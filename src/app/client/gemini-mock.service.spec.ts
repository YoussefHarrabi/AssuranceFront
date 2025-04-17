import { TestBed } from '@angular/core/testing';

import { GeminiMockService } from './gemini-mock.service';

describe('GeminiMockService', () => {
  let service: GeminiMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
