import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangmanPageComponent } from './hangman-page.component';

describe('HangmanPageComponent', () => {
  let component: HangmanPageComponent;
  let fixture: ComponentFixture<HangmanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HangmanPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HangmanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
