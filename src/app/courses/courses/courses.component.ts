import { Component, inject } from '@angular/core';
import { Course } from '../model/course';
import { materialImports } from '../../shared/material/material.imports';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/error-dialog/error-dialog.component';
import { CategoryPipe } from '../../shared/pipes/category-pipe';


@Component({
  selector: 'app-courses',
  imports: [CommonModule, materialImports, CategoryPipe],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class Courses {
  courses$: Observable<Course[]>;
  displayedColumns = ['name', 'category'];
  private service = inject(CoursesService);
  private dialog = inject(MatDialog)

  constructor() {
    this.courses$ = this.service.list()
    .pipe(
      catchError(error => {
        this.openDialogError('Erro! Não foi possível carregar a lista de cursos!');
        return of([]) //returns an Observable with an empty array
      })
    );
  }

  openDialogError(errorMessage: string) {
        this.dialog.open(ErrorDialogComponent, {
      data: errorMessage
    });
  }
}
