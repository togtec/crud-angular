import { Component, inject } from '@angular/core';
import { materialImports } from '../../shared/material/material.imports';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    materialImports,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss'
})
export class CourseFormComponent {
  private formBuider = inject(FormBuilder);
  private service = inject(CoursesService);
  private _snackBar = inject(MatSnackBar);

  form: FormGroup = this.formBuider.group({
    name: [null],
    category: [null]
  });

  onSubmit() {
    //console.log('onSubmit');
    //console.log(this.form.value);
    this.service.save(this.form.value).subscribe({
      next: () => console.log(),
      error: () => this.onError()
    });
  }

  onCancel() {

  }

  private onError() {
    this._snackBar.open('Erro ao salvar curso!', '', { duration: 3000 });
  }

}
