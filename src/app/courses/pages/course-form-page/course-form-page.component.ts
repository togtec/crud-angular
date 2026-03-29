import { Component, inject } from '@angular/core';
import { materialImports } from '../../../shared/material/material.imports';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CourseFormComponent } from '../../components/course-form/course-form.component';

@Component({
  selector: 'app-course-form-page',
  standalone: true,
  imports: [
    materialImports,
    ReactiveFormsModule,
    CourseFormComponent
  ],
  templateUrl: './course-form-page.component.html',
  styleUrl: './course-form-page.component.scss'
})
export class CourseFormPageComponent {
  private formBuilder = inject(FormBuilder);
  private service = inject(CoursesService);
  private _snackBar = inject(MatSnackBar);
  private location = inject(Location);

  form: FormGroup = this.formBuilder.group({
    name: new FormControl<string>('', {
       nonNullable: true,
       validators: Validators.required
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required
    })
  })

  onSubmit() {
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
