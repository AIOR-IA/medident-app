import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmCalendarDialogComponent } from './confirm-calendar-dialog/confirm-calendar-dialog.component';



@NgModule({
  declarations: [

    ConfirmDialogComponent,
    ConfirmCalendarDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ]
})
export class CoreModule { }
