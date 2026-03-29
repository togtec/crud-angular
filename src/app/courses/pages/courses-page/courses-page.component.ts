import { Component, inject } from '@angular/core';
import { Course } from '../../model/course';
import { materialImports } from '../../../shared/material/material.imports';
import { CoursesService } from '../../services/courses.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseListComponent } from '../../components/course-list/course-list.component';


@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, materialImports, CourseListComponent],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.scss'
})
export class CoursesPageComponent {
  courses$: Observable<Course[]>;
  private service = inject(CoursesService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


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

  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
