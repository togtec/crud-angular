import { Routes } from '@angular/router';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { CourseFormPageComponent } from './pages/course-form-page/course-form-page.component';
import { courseResolver } from './guards/course-resolver';

export const COURSES_ROUTES: Routes = [
  { path: '', component: CoursesPageComponent },
  { path: 'new', component: CourseFormPageComponent, resolve: {courseData: courseResolver} },
  { path: 'edit/:id', component: CourseFormPageComponent, resolve: {courseData: courseResolver} }
];
