import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodboardDetailsComponent } from './moodboard-details.component';

describe('MoodboardDetailsComponent', () => {
  let component: MoodboardDetailsComponent;
  let fixture: ComponentFixture<MoodboardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoodboardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
