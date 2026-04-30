import { Component, inject } from '@angular/core';
import { materialImports } from '../material/material.imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [materialImports],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialogComponent {
  readonly data = inject<string>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  onConfirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
