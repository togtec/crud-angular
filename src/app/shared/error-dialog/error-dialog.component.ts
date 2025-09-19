import { Component, inject } from '@angular/core';
import { materialImports } from '../../shared/material/material.imports';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog.component',
  imports: [materialImports],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
