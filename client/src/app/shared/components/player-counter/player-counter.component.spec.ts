import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCounterComponent } from './player-counter.component';

describe('PlayerCounterComponent', () => {
  let component: PlayerCounterComponent;
  let fixture: ComponentFixture<PlayerCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
