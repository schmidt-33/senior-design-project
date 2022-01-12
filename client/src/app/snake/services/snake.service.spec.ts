import { TestBed } from '@angular/core/testing';

import { SnakeService } from './snake.service';

describe('SnakeWebsocketService', () => {
  let service: SnakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
