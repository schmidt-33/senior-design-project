import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteroidsPageComponent } from './asteroids-page.component';

describe('AsteroidsPageComponent', () => {
  let component: AsteroidsPageComponent;
  let fixture: ComponentFixture<AsteroidsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsteroidsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteroidsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
