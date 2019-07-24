import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TaskDirective } from "./task.directive";
import { MultichoiceComponent } from './multichoice/multichoice.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    TaskDirective,
    MultichoiceComponent
  ],
  exports: [
    TaskDirective,
    MultichoiceComponent
  ],
  entryComponents: [
    MultichoiceComponent
  ]
})
export class TasksModule { }
