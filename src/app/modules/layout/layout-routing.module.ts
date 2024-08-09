import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../services/auth.guard";
import { LayoutComponent } from "./layout.component";


const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
        import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: "products",
        loadChildren: () =>
          import("../product/product.module").then((m) => m.ProductModule),
        canActivate: [AuthGuard],
      },
      {
        path: "projects",
        loadChildren: () =>
          import("../projects/projects.module").then((m)=>m.ProjectsModule)
      },
      {
        path: "moodboard",
        loadChildren: () =>
          import("../moodboard/moodboard.module").then((m) => m.MoodboardModule),
          canActivate: [AuthGuard],
      },
      {
        path: "quote",
        loadChildren: () =>
          import("../quotes/quotes.module").then((m) => m.QuotesModule),
          canActivate: [AuthGuard],
      },
      {
        path: "supplier",
        loadChildren: () =>
          import("../supplier-history/supplier-history.module").then((m) => m.SupplierHistoryModule),
          canActivate: [AuthGuard],
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
