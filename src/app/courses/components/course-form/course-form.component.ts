import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { materialImports } from '../../../shared/material/material.imports';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [materialImports, ReactiveFormsModule, MatInputModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent {
  @Input() form!: FormGroup;

  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

}
