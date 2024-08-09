import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoodboardComponent } from './edit-moodboard.component';

describe('EditMoodboardComponent', () => {
  let component: EditMoodboardComponent;
  let fixture: ComponentFixture<EditMoodboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMoodboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMoodboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
