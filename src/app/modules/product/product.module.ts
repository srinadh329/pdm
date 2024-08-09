import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';


import { ItemDetailsComponent } from './item-details/item-details.component';
import { SharedModule } from '../../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import{ImageLensComponent} from './image-lens/image-lens.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ItemsNewComponent } from './items-new/items-new.component';
import { DialogComponent } from './dialog/dialog.component';
import { SearchComponent } from './search/search.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { InspirationListComponent } from './inspiration-list/inspiration-list.component';
import { InspirationDetailsComponent } from './inspiration-details/inspiration-details.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { DragdropDirective } from './dragdrop.directive';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    SearchComponent,
    ItemDetailsComponent,
    ImageLensComponent,
    ItemsNewComponent,
    DialogComponent,
    RequestDetailsComponent,
    InspirationListComponent,
    InspirationDetailsComponent,
    CreateProductComponent,
    DragdropDirective
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    CarouselModule,
    NgxSpinnerModule,
    NgxJsonViewerModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule
  ]
})
export class ProductModule { }
