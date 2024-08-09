import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemDetailsComponent } from "./item-details/item-details.component";
import { SearchComponent } from "./search/search.component";
import { ImageLensComponent } from "./image-lens/image-lens.component";
import { ItemsNewComponent } from "./items-new/items-new.component";
import { RequestDetailsComponent } from "./request-details/request-details.component";
import { InspirationListComponent } from "./inspiration-list/inspiration-list.component";
import { InspirationDetailsComponent } from "./inspiration-details/inspiration-details.component";
import { CreateProductComponent } from "./create-product/create-product.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  // {
  //   path: "list",
  //   component:ItemsComponent
  // },
  {
    path: "list",
    component:ItemsNewComponent
  },
  {
    path: "view/:id",
    component:ItemDetailsComponent
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'imageLens',
    component:ImageLensComponent
  },
  {
    path: 'inspirationList',
    component:InspirationListComponent
  },
  {
    path: 'inspirationDetails',
    component:InspirationDetailsComponent
  },
  {
    path: 'createProduct',
    component:CreateProductComponent
  },
  // {
  //   path: 'altRequestDetails',
  //   component:RequestDetailsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
