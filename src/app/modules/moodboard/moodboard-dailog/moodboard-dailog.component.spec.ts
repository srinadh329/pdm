import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodboardDailogComponent } from './moodboard-dailog.component';

describe('MoodboardDailogComponent', () => {
  let component: MoodboardDailogComponent;
  let fixture: ComponentFixture<MoodboardDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoodboardDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodboardDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
