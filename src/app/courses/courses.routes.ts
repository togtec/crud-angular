import { Routes } from '@angular/router';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { CourseFormPageComponent } from './pages/course-form-page/course-form-page.component';

export const COURSES_ROUTES: Routes = [
  { path: '', component: CoursesPageComponent },
  { path: 'new', component: CourseFormPageComponent }
];
