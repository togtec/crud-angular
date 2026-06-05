import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFormPageComponent } from './course-form-page.component.js';
import { CoursesService } from '../../services/courses.service.js';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course.js';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

function createActivatedRouteMock(course: Course) {
  return {
    snapshot: {
      data: {
        courseData: course
      }
    }
  };
}

fdescribe('CourseFormPage', () => {
  let component: CourseFormPageComponent;
  let fixture: ComponentFixture<CourseFormPageComponent>;
  let courseServiceSpy: jasmine.SpyObj<CoursesService>;
  let locationSpy: jasmine.SpyObj<Location>;
  const course: Course = { _id: '2', name: 'Spring Boot', category: 'Back-End'};
  const emptyCourse: Course = { _id: '', name: '', category: ''};

  async function setup(routeCourse: Course) {
    courseServiceSpy = jasmine.createSpyObj('CoursesService', ['save']);

    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [CourseFormPageComponent],
      providers: [
        { provide: CoursesService, useValue: courseServiceSpy },

        { provide: Location, useValue: locationSpy },

        { provide: ActivatedRoute, useValue: createActivatedRouteMock(routeCourse) },

        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }
      ]
    })
    .overrideProvider(MatSnackBar, { useValue: { open: jasmine.createSpy('open') } })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should populate form with course data', async () => {
    await setup(course);

    expect(component.form.get('_id')?.value)
      .toBe('2');

    expect(component.form.get('name')?.value)
      .toBe('Spring Boot');

    expect (component.form.get('category')?.value)
      .toBe('Back-End');
  });

  it('should set toolbar title to Edit Course when course has an id', async () => {
    await setup(course);

    expect(component.toolbarTitle)
      .toBe('Edit Course');
  });

  it('should set toolbar title to Create Course when course has no id', async () => {
    await setup(emptyCourse);

    expect(component.toolbarTitle)
      .toBe('Create Course');
  });

  it('should mark all fields as touched when form is invalid', async () => {
    await setup(emptyCourse);

    component.onSave();

    expect(component.form.touched).toBeTrue();

    expect(courseServiceSpy.save).not.toHaveBeenCalled();
  });

  it('should call onSave when child emits save event', async () => {
    await setup(course);

    spyOn(component, 'onSave');

    const form = fixture.debugElement.query(By.css('app-course-form'));

    form.componentInstance.save.emit();

    expect(component.onSave).toHaveBeenCalled();
  });

  it('should call onCancel when child emits cancel event', async () => {
    await setup(course);

    spyOn(component, 'onCancel');

    const form = fixture.debugElement.query(By.css('app-course-form'));

    form.componentInstance.cancel.emit();

    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should save the course successfully', async () => {
    await setup(course);

    const snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    courseServiceSpy.save.and.returnValue(of(course));

    component.onSave();

    expect(courseServiceSpy.save).toHaveBeenCalledOnceWith(component.form.value);

    expect(snackBar.open)
      .toHaveBeenCalledWith(
      'Course saved successfully!',
      '',
      { duration: 3000 }
    );

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should show an error message when save fails', async () => {
    await setup(course);

    const snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    courseServiceSpy.save.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.onSave();

    expect(courseServiceSpy.save).toHaveBeenCalledOnceWith(component.form.value);

    expect(snackBar.open)
      .toHaveBeenCalledWith(
      'Error saving course!',
      '',
      { duration: 3000 }
    );

    expect(locationSpy.back).not.toHaveBeenCalled();
  });

  it('should navigate back when the user clicks cancel', async () => {
    await setup(course);

    component.onCancel();

    expect(locationSpy.back).toHaveBeenCalled();
  })

});
