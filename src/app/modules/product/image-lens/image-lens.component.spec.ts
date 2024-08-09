import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLensComponent } from './image-lens.component';

describe('ImageLensComponent', () => {
  let component: ImageLensComponent;
  let fixture: ComponentFixture<ImageLensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageLensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageLensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
