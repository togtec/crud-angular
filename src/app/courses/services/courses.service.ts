import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { delay, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  //private readonly API = '/assets/courses.json';
  //private readonly API = 'http://localhost:8080/api/courses';
  private readonly API = 'api/courses';

  constructor(private httpClient: HttpClient) {}

  list() {
    return this.httpClient.get<Course[]>(this.API)
    .pipe(
      first(),
      //delay(3000),
      tap(courses => console.log(courses))
    );
  }

  save(record: Course) {
    //console.log(record);
    return this.httpClient.post<Course>(this.API, record).pipe(first());
  }
}
