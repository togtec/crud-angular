import { Component, inject } from '@angular/core';
import { materialImports } from '../../../shared/material/material.imports';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CourseFormComponent } from '../../components/course-form/course-form.component';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';

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
  private route = inject(ActivatedRoute);
  public toolbarTitle = '';


  form: FormGroup = this.formBuilder.group({
    _id: new FormControl<string>('', {
       nonNullable: true
    }),
    name: new FormControl<string>('', {
       nonNullable: true,
       validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required
    })
  })

  ngOnInit() {
    const course: Course = this.route.snapshot.data['courseData'];

    this.form.patchValue({
      _id: course._id,
      name: course.name,
      category: course.category
    });

    //define toolbar title
    if (course && course._id) {
      this.toolbarTitle = 'Edit Course';
    } else {
      this.toolbarTitle = 'Create Course';
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.service.save(this.form.value).subscribe({
      next: () => this.onSuccess(),
      error: () => this.onError()
    });
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this._snackBar.open('Course saved successfully!', '', { duration: 3000 });
    this.location.back();
  }

  private onError() {
    this._snackBar.open('Error saving course!', '', { duration: 3000 });
  }

}
