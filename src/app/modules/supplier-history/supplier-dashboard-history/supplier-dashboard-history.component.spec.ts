import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDashboardHistoryComponent } from './supplier-dashboard-history.component';

describe('SupplierDashboardHistoryComponent', () => {
  let component: SupplierDashboardHistoryComponent;
  let fixture: ComponentFixture<SupplierDashboardHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierDashboardHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDashboardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
