import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorPlanDetailsComponent } from './floor-plan-details.component';

describe('FloorPlanDetailsComponent', () => {
  let component: FloorPlanDetailsComponent;
  let fixture: ComponentFixture<FloorPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorPlanDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
