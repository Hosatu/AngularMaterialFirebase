import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TaskDirective } from "./task.directive";
import { MultichoiceComponent } from './multichoice/multichoice.component';
import { SinglechoiceComponent } from './singlechoice/singlechoice.component';
import { MatRadioModule, MatButtonModule, MatInputModule } from "@angular/material";
import { MultifillComponent } from './multifill/multifill.component';
import { SanitizePipe } from "@shared/pipes/sanitize-pipe.pipe";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [
    TaskDirective,
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    SanitizePipe
  ],
  exports: [
    TaskDirective,
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent
  ],
  entryComponents: [
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent
  ]
})
export class TasksModule { }
