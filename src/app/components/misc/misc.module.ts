import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatInputModule, MatNativeDateModule,
         MatSlideToggleModule, MatStepperModule, MatTooltipModule, MatSidenavModule,
         MatTableModule, MatCardModule, MatDatepickerModule, MatExpansionModule,
         MatIconModule, MatToolbarModule } from '@angular/material';

// import { CdkTableModule } from '@angular/cdk';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MiscComponent } from './misc.component';
import { TableComponent } from './table/table.component';
import { StepperComponent } from './stepper/stepper.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';

@NgModule({
  declarations: [
    MiscComponent,
    TableComponent,
    StepperComponent,
    DragDropComponent,
    ExpansionPanelComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatNativeDateModule,
    MatSlideToggleModule, MatStepperModule, MatTooltipModule, MatSidenavModule,
    MatTableModule, MatCardModule, MatDatepickerModule, MatExpansionModule,
    MatIconModule, MatToolbarModule,
    FormsModule, ReactiveFormsModule,
    DragDropModule
  ],
  exports: [
    MiscComponent,
    TableComponent,
    StepperComponent,
    ExpansionPanelComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class MiscModule {
}
