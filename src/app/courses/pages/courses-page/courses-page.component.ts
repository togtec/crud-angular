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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog';


@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [CommonModule, materialImports, CourseListComponent],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.scss'
})
export class CoursesPageComponent {
  courses$: Observable<Course[]> | null = null;

  private service = inject(CoursesService);

  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  private router = inject(Router);
  private route = inject(ActivatedRoute);


  constructor() { }

   ngOnInit() {
    this.refresh();
   }

  refresh() {
    this.courses$ = this.service.list()
    .pipe(
      catchError(error => {
        this.openDialogError('We could not load the list of courses!');
        return of([]) //returns an Observable with an empty array
      })
    );
  }

  onDelete(course: Course) {
    const confirmDialogRef = this.openConfirmationDialog(
      'Are you sure you want to delete this record? This action cannot be undone.'
    );

    confirmDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.remove(course._id).subscribe(
          () => {
            this.refresh();
            this._snackBar.open('Course removed successfully!', 'x', {
              duration: 3000 ,
              verticalPosition:'top',
              horizontalPosition:'center'
            });
          },
          () => this.openDialogError("The course cannot be removed!")
        );
      }
    });
  }

  openDialogError(errorMessage: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMessage
    });
  }
  openConfirmationDialog(confirmationMessage: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: confirmationMessage
    });
  }

  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], {relativeTo: this.route});
  }

}
