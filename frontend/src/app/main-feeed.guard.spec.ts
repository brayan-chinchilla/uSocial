import { TestBed } from '@angular/core/testing';

import { MainFeeedGuard } from './main-feeed.guard';

describe('MainFeeedGuard', () => {
  let guard: MainFeeedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MainFeeedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
