import { Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses';
import { CourseFormComponent } from './course-form/course-form';

export const COURSES_ROUTES: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'new', component: CourseFormComponent }
];
