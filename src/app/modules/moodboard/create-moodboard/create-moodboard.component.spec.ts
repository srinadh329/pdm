import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMoodboardComponent } from './create-moodboard.component';

describe('CreateMoodboardComponent', () => {
  let component: CreateMoodboardComponent;
  let fixture: ComponentFixture<CreateMoodboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMoodboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMoodboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
