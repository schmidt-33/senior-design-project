import { TestBed } from '@angular/core/testing';

import { AsteroidsService } from './asteroids.service';

describe('AsteroidsService', () => {
  let service: AsteroidsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsteroidsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
