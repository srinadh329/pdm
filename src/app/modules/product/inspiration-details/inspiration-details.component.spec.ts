import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspirationDetailsComponent } from './inspiration-details.component';

describe('InspirationDetailsComponent', () => {
  let component: InspirationDetailsComponent;
  let fixture: ComponentFixture<InspirationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspirationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspirationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
