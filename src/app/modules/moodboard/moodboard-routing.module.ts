import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateMoodboardComponent } from "src/app/modules/moodboard/create-moodboard/create-moodboard.component";
import { MoodboardDetailsComponent } from "src/app/modules/moodboard/moodboard-details/moodboard-details.component";
import { MoodboardComponent } from "src/app/modules/moodboard/moodboard-list/moodboard.component";
import { MoodboardFilterComponent } from "src/app/modules/moodboard/moodboard-filter/moodboard-filter.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  { path: "list/:type", component: MoodboardComponent },
  { path: "view/:id", component: MoodboardDetailsComponent },
  { path: "create", component: CreateMoodboardComponent },
  { path: "mb-filter", component: MoodboardFilterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoodboardRoutingModule {}
