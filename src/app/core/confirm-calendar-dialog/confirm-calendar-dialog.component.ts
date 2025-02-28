import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-calendar-dialog',
  templateUrl: './confirm-calendar-dialog.component.html',
  styleUrls: ['./confirm-calendar-dialog.component.scss']
})
export class ConfirmCalendarDialogComponent {
 constructor(
    public dialogRef: MatDialogRef<ConfirmCalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onAction(resp): void {
    this.dialogRef.close(resp);
  }
}
