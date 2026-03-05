import { Component, inject } from '@angular/core';
import { materialImports } from '../material/material.imports';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [materialImports],
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.scss'
})
export class ErrorDialogComponent {
  data = inject<string>(MAT_DIALOG_DATA);
}
