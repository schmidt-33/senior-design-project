import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundWordChooserComponent } from './round-word-chooser.component';

describe('RoundWordChooserComponent', () => {
  let component: RoundWordChooserComponent;
  let fixture: ComponentFixture<RoundWordChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundWordChooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundWordChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
