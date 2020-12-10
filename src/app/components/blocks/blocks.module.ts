// Modules 3rd party
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule } from '@angular/material';

// Components
import { CardBlockComponent } from './card-block/card-block.component';
import { ThirdBlockComponent } from './third-block/third-block.component';
import { AppRoutingModule } from 'src/app/app.routing';

@NgModule({
  declarations: [
    CardBlockComponent,
    ThirdBlockComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule, AppRoutingModule
  ],
  exports: [
    CardBlockComponent,
    ThirdBlockComponent
  ]
})
export class BlocksModule {
}
