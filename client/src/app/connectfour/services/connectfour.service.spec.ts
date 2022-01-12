import { TestBed } from '@angular/core/testing';

import { ConnectfourService } from './connectfour.service';

describe('ConnectfourService', () => {
  let service: ConnectfourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectfourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
