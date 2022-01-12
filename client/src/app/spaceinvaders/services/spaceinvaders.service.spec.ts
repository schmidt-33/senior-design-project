import { TestBed } from '@angular/core/testing';

import { SpaceinvadersService } from './spaceinvaders.service';

describe('SpaceinvadersWebsocketService', () => {
  let service: SpaceinvadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceinvadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});