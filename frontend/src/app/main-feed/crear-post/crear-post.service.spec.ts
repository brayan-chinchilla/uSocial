import { TestBed } from '@angular/core/testing';

import { CrearPostService } from './crear-post.service';

describe('CrearPostService', () => {
  let service: CrearPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
