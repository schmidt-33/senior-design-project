import { TestBed } from '@angular/core/testing';

import { MinesweeperService } from './minesweeper.service';

describe('MinesweeperWebsocketService', () => {
  let service: MinesweeperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinesweeperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});