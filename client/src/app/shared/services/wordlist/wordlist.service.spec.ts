import { TestBed } from '@angular/core/testing';

import { WordListService } from './wordlist.service';

describe('WordlistService', () => {
  let service: WordListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
