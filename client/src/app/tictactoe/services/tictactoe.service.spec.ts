import { TestBed } from '@angular/core/testing';

import { TictactoeService } from './tictactoe.service';

describe('TictactoeWebsocketService', () => {
  let service: TictactoeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TictactoeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});