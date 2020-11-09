import { TestBed } from '@angular/core/testing';

import { CovidGraphGuard } from './covid-graph.guard';

describe('CovidGraphGuard', () => {
  let guard: CovidGraphGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CovidGraphGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
