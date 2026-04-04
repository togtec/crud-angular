import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';


export const courseResolver: ResolveFn<Course> = (route) => {
   const service = inject(CoursesService);
   const id = route.paramMap.get('id');

   if (id) {
    return service.loadById(id);
   }

   return {
    _id: '',
    name: '',
    category: ''
   } as Course;

}
