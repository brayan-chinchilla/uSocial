import { TestBed } from '@angular/core/testing';

import { MainFeedService } from './main-feed.service';

describe('MainFeedService', () => {
  let service: MainFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
