import { TestBed } from '@angular/core/testing';

import { CreateMoodboardService } from './create-moodboard.service';

describe('CreateMoodboardService', () => {
  let service: CreateMoodboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateMoodboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
