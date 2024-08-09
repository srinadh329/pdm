import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierHistoryRoutingModule } from './supplier-history-routing.module';
import { SupplierDashboardHistoryComponent } from './supplier-dashboard-history/supplier-dashboard-history.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

@NgModule({
  declarations: [
    SupplierDashboardHistoryComponent,
    DialogBoxComponent
  ],
  imports: [
    CommonModule,
    SupplierHistoryRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule
  ]
})
export class SupplierHistoryModule { }
