import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspirationListComponent } from './inspiration-list.component';

describe('InspirationListComponent', () => {
  let component: InspirationListComponent;
  let fixture: ComponentFixture<InspirationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspirationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspirationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
