import { Component } from '@angular/core';
import { Course } from '../model/course';
import { materialImports } from '../../shared/material/material.imports';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-courses',
  imports: [materialImports],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class Courses {
  courses: Observable<Course[]>;
  displayedColumns = ['name', 'category'];

  constructor(private service: CoursesService) {
    this.courses = this.service.list();
  }

}
