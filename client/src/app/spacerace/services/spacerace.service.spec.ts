import { TestBed } from '@angular/core/testing';

import { SpaceraceService } from './spacerace.service';

describe('SpaceraceWebsocketService', () => {
  let service: SpaceraceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceraceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});