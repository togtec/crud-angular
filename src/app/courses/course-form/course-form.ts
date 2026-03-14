import { Component, inject } from '@angular/core';
import { materialImports } from '../../shared/material/material.imports';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

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
  private location = inject(Location);

  form: FormGroup = this.formBuider.group({
    name: [null],
    category: [null]
  });

  onSubmit() {
    //console.log('onSubmit');
    //console.log(this.form.value);
    this.service.save(this.form.value).subscribe({
      next: () => this.onSuccess(),
      error: () => this.onError()
    });
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this._snackBar.open('Curso salvo com sucesso!', '', { duration: 3000 });
    this.location.back();
  }

  private onError() {
    this._snackBar.open('Erro ao salvar curso!', '', { duration: 3000 });
  }

}
