import { TestBed } from '@angular/core/testing';

import { ScrollToTopService } from './scroll-to-top.service';

describe('ScrollToTopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollToTopService = TestBed.get(ScrollToTopService);
    expect(service).toBeTruthy();
  });
});
