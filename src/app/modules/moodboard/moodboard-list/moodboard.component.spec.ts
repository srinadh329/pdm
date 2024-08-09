import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodboardComponent } from './moodboard.component';

describe('MoodboardComponent', () => {
  let component: MoodboardComponent;
  let fixture: ComponentFixture<MoodboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoodboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
