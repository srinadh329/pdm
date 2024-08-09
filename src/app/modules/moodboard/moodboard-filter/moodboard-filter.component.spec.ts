import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodboardFilterComponent } from './moodboard-filter.component';

describe('MoodboardFilterComponent', () => {
  let component: MoodboardFilterComponent;
  let fixture: ComponentFixture<MoodboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoodboardFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
