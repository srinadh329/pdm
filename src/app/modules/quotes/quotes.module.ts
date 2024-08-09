import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from 'src/app/modules/quotes/quotes-routing.module';
import { MyquoteComponent } from 'src/app/modules/quotes/myquote/myquote.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogBoxComponent } from 'src/app/modules/quotes/dialog-box/dialog-box.component';
import { EditQuoteComponent } from 'src/app/modules/quotes/edit-quote/edit-quote.component';
import { CreateQuoteComponent } from 'src/app/modules/quotes/create-quote/create-quote.component';
import { FloorPlanDetailsComponent } from './floor-plan-details/floor-plan-details.component';
import { UnitDetailsComponent } from './unit-details/unit-details.component';


@NgModule({
  declarations: [MyquoteComponent,EditQuoteComponent,CreateQuoteComponent, DialogBoxComponent, FloorPlanDetailsComponent, UnitDetailsComponent],
  imports: [
    CommonModule,
    QuotesRoutingModule,
    SharedModule
  ],
  entryComponents: [ DialogBoxComponent ]
})
export class QuotesModule { }
