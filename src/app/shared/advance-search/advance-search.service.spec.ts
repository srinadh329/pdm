import { TestBed } from '@angular/core/testing';

import { AdvanceSearchService } from './advance-search.service';

describe('AdvanceSearchService', () => {
  let service: AdvanceSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvanceSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
