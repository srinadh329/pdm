import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuoteComponent } from "src/app/modules/quotes/create-quote/create-quote.component";
import { EditQuoteComponent } from "src/app/modules/quotes/edit-quote/edit-quote.component";
import { MyquoteComponent } from "src/app/modules/quotes/myquote/myquote.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  {
    path: "view/:id",
    component: EditQuoteComponent,
  },
  {
    path: "list/:type",
    component: MyquoteComponent,
  },
  {
    path: "create",
    component: CreateQuoteComponent,
  },
  {
    path: "order/:id",
    component: EditQuoteComponent,
  },

  {
    path: 'orders/:type',
    component: MyquoteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesRoutingModule {}
