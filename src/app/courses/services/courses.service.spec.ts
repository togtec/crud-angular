import { TestBed } from '@angular/core/testing';

import { CoursesService } from './courses.service';
import { Course } from '../model/course';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

fdescribe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 500 error when backend is down', () => {
    let errorResponse!: HttpErrorResponse;

    service.list().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        errorResponse = error;
      }
    });

    const req = httpMock.expectOne(service['API']);
    expect(req.request.method).toBe('GET');

    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(errorResponse.status).toBe(500);
  });

  it('should return a list of courses', () => {
    const mockCourses: Course[] = [
      { _id: '1', name: 'Angular Basics', category: 'Front-End' },
      { _id: '2', name: 'Spring Boot', category: 'Back-End'},
      { _id: '3', name: 'HTML', category: 'Front-End'},
      { _id: '4', name: 'Java', category: 'Back-End'}
    ]

    let result: Course[] | undefined;
    service.list().subscribe(courses => {
      result = courses;
    });

    const req = httpMock.expectOne(service['API']);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourses);
    expect(result).toEqual(mockCourses);
  });

  it('should return a course by id', () => {
    const mockCourse: Course = {
      _id: '1',
      name: 'Angular Basics',
      category: 'Front-End'
    };

    let result!: Course;
    service. loadById('1') .subscribe(course => {
      result = course;
    });

    const req = httpMock.expectOne(`${service['API']}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toContain('/1');

    req.flush(mockCourse);
    expect(result).toEqual(mockCourse);
  });

  it('should return 404 when loadById is called with non-existing id', () => {
    let errorResponse!: HttpErrorResponse;

    service.loadById('99').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        errorResponse = error;
      }
    });

    const req = httpMock.expectOne(`${service['API']}/99`);
    expect(req.request.method).toBe('GET');

    req.flush('Not Found', {
      status: 404,
      statusText: 'Not Found'
    });

    expect(errorResponse.status).toBe(404);
  });

  it('should create a new course when save is called without id', () => {
    const newCourse: Partial<Course> = {
      name: 'Angular Infinite',
      category: 'Front-End'
    };

    const createdCourse: Course = {
      _id: '1',
      name: 'Angular Infinite',
      category: 'Front-End'
    }

    let result!: Course;
    service.save(newCourse).subscribe( course => {
      result = course;
    });

    const req = httpMock.expectOne(service['API']);
    expect(req.request.method).toBe('POST');

    req.flush(createdCourse);
    expect(result._id).toBe('1');
    expect(result.name).toBe('Angular Infinite');
    expect(result.category).toBe('Front-End');
  })

  it('should update a course when save is called with id', () => {
    const updatedCourse: Course = {
      _id: '1',
      name: 'Angular Infinite Updated',
      category: 'Front-End Updated'
    }

    let result!: Course;
    service.save(updatedCourse).subscribe(course => {
      result = course;
    });

    const req = httpMock.expectOne(`${service['API']}/1`);
    expect(req.request.method).toBe('PUT');

    req.flush(updatedCourse);
    expect(result).toEqual(updatedCourse);
  });

  it('should delete a course', () => {
    let result: void;
    let completed = false;

    service.remove('1').subscribe({
      next: (response) => {
        result = response;
      },
      complete: () => {
        completed = true;
      }
    });

    const req = httpMock.expectOne(`${service['API']}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.url).toContain('/1');

    req.flush(null, {
      status: 204,
      statusText: 'No Content'
    });

    expect(result).toBeNull();
    expect(completed).toBeTrue();
  });


  it('should return 404 when remove is called with non-existing id', () => {
    let errorResponse!: HttpErrorResponse;

    service.remove('99').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        errorResponse = error;
      }
    });

    const req = httpMock.expectOne(`${service['API']}/99`);
    expect(req.request.method).toBe('DELETE');

    req.flush('Not Found', {
      status: 404,
      statusText: 'Not Found'
    });

    expect(errorResponse.status).toBe(404);
  });

});
