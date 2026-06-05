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

  @Output() save = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);

    if (field?.hasError('required')) {
      return 'Required field';
    }

    if (field?.hasError('minlength')) {
      return 'Minimum 5 characters';
    }

    if (field?.hasError('maxlength')) {
      return 'Maximum 100 characters';
    }

    return 'Invalid field';
  }

}
