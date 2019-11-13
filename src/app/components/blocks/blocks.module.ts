// Modules 3rd party
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule } from '@angular/material';

// Components
import { CardBlockComponent } from './card-block/card-block.component';
import { ThirdBlockComponent } from './third-block/third-block.component';

@NgModule({
  declarations: [
    CardBlockComponent,
    ThirdBlockComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule
  ],
  exports: [
    CardBlockComponent,
    ThirdBlockComponent
  ]
})
export class BlocksModule {
}
