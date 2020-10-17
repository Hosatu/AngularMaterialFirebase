import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TaskDirective } from "./task.directive";
import { MultichoiceComponent } from './multichoice/multichoice.component';
import { SinglechoiceComponent } from './singlechoice/singlechoice.component';
import { MatRadioModule, MatButtonModule, MatInputModule, MatCheckboxModule } from "@angular/material";
import { MultifillComponent } from './multifill/multifill.component';
import { SanitizePipe } from "@shared/pipes/sanitize-pipe.pipe";
import { MatchingComponent } from "./matching/matching.component";
import { DragDropModule } from "@angular/cdk/drag-drop";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    DragDropModule
  ],
  declarations: [
    TaskDirective,
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    MatchingComponent,
    SanitizePipe
  ],
  exports: [
    TaskDirective,
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    MatchingComponent
  ],
  entryComponents: [
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    MatchingComponent
  ]
})
export class TasksModule { }
