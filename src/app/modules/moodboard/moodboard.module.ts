import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodboardComponent } from 'src/app/modules/moodboard/moodboard-list/moodboard.component';
import { MoodboardDetailsComponent } from 'src/app/modules/moodboard/moodboard-details/moodboard-details.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MoodboardDailogComponent } from 'src/app/modules/moodboard/moodboard-dailog/moodboard-dailog.component';
import { CreateMoodboardComponent } from 'src/app/modules/moodboard/create-moodboard/create-moodboard.component';
import { MoodboardFilterComponent } from 'src/app/modules/moodboard/moodboard-filter/moodboard-filter.component';
import { EditMoodboardComponent } from 'src/app/modules/moodboard/edit-moodboard/edit-moodboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MoodboardRoutingModule } from 'src/app/modules/moodboard/moodboard-routing.module';


@NgModule({
  declarations: [MoodboardComponent, 
    MoodboardDetailsComponent,
    MoodboardDailogComponent,
    CreateMoodboardComponent,
    MoodboardFilterComponent,
    EditMoodboardComponent],
  imports: [
    CommonModule,
    MoodboardRoutingModule,
    SharedModule,
    CarouselModule
  ],
  entryComponents: [MoodboardDailogComponent]
})
export class MoodboardModule { }
