import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TaskDirective } from "./task.directive";
import { MultichoiceComponent } from './multichoice/multichoice.component';
import { SinglechoiceComponent } from './singlechoice/singlechoice.component';
import { MatRadioModule, MatButtonModule, MatInputModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatGridListModule } from "@angular/material";
import { MultifillComponent } from './multifill/multifill.component';
import { SanitizePipe } from "@shared/pipes/sanitize-pipe.pipe";
import { MatchingComponent } from "./matching/matching.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CorpusComponent } from "./corpus/corpus.component";
import { TreesComponent } from "./trees/trees.component";
import { TreeRenderersModule } from "@shared/tree-renderers/tree-renderers.module";
import { HttpClientModule } from "@angular/common/http";
import { MajkaComponent } from "./majka/majka.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule,
    TreeRenderersModule,
    HttpClientModule,
    MatGridListModule
  ],
  declarations: [
    TaskDirective,
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    MatchingComponent,
    CorpusComponent,
    TreesComponent,
    MajkaComponent,
    SanitizePipe
  ],
  exports: [
    TaskDirective,
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    MatchingComponent,
    CorpusComponent,
    TreesComponent,
    MajkaComponent
  ],
  entryComponents: [
    MultichoiceComponent,
    SinglechoiceComponent,
    MultifillComponent,
    MatchingComponent,
    CorpusComponent,
    TreesComponent,
    MajkaComponent
  ]
})
export class TasksModule { }
