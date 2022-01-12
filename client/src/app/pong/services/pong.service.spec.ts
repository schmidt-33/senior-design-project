import { TestBed } from '@angular/core/testing';

import { PongService } from './pong.service';

describe('PongWebsocketService', () => {
  let service: PongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});