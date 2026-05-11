import { TestBed } from '@angular/core/testing';
import { convertToParamMap, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { courseResolver } from './course-resolver';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { firstValueFrom, Observable, of } from 'rxjs';

fdescribe('courseResolver', () => {
  const executeResolver: ResolveFn<Course> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => courseResolver(...resolverParameters));

  let courseServiceSpy: jasmine.SpyObj<CoursesService>;

  beforeEach(() => {
     courseServiceSpy = jasmine.createSpyObj('CoursesService', ['loadById']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CoursesService,
          useValue: courseServiceSpy
        }
      ]
    });
  });

  it('should return a course when id is provided', async () => {
    const mockCourse: Course = {
      _id: '1',
      name: 'Angular Basics',
      category: 'Front-End'
    };

    courseServiceSpy.loadById.and.returnValue(of(mockCourse));

    const routeMock = {
      paramMap: convertToParamMap({ id: '1' })
    };

    const resolverResult =  executeResolver(
      routeMock as any,
      {} as RouterStateSnapshot
    );

    const result = await firstValueFrom(
      resolverResult as Observable<Course>
    );

    expect(result).toEqual(mockCourse);
    expect(courseServiceSpy.loadById).toHaveBeenCalledWith('1');
  });


  it('should return an empty course if route param id is missing', () => {
    const routeMock = {
      paramMap: convertToParamMap({})
    };

    const resolverResult =  executeResolver(
      routeMock as any,
      {} as RouterStateSnapshot
    );

    expect(resolverResult).toEqual({
      _id: '',
      name: '',
      category: ''
    });

    expect(courseServiceSpy.loadById).not.toHaveBeenCalled();
  });

});
