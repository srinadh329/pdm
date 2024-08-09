import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Ng5SliderModule } from "ng5-slider";
import { ToastrModule } from "ngx-toastr";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { OrderByPipe } from "../pipes/order-by.pipe";
import { AdvanceSearchComponent } from "./advance-search/advance-search.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    OrderByPipe,
    AdvanceSearchComponent,
  ],
  imports: [
    CommonModule,
    Ng5SliderModule,
    ToastrModule,
    InfiniteScrollModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    CarouselModule
  ],
  exports: [
    FormsModule,
    Ng5SliderModule,
    ToastrModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    NgSelectModule,
    OrderByPipe,
    AdvanceSearchComponent,
    NgbModule,
    NgMultiSelectDropDownModule,
  ],
})
export class SharedModule {}
