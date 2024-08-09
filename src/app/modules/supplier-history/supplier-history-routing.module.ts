import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierDashboardHistoryComponent } from './supplier-dashboard-history/supplier-dashboard-history.component';

const routes: Routes = [
  {
    path: 'supplierHistory',
    component:SupplierDashboardHistoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierHistoryRoutingModule { }
