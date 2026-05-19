import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CoursesPageComponent } from './courses-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Course } from '../../model/course';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog';
import { By } from '@angular/platform-browser';


fdescribe('CoursesPage', () => {
  let component: CoursesPageComponent;
  let fixture: ComponentFixture<CoursesPageComponent>;
  let courseServiceSpy: jasmine.SpyObj<CoursesService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    courseServiceSpy = jasmine.createSpyObj('CoursesService', ['list', 'remove']);
    courseServiceSpy.list.and.returnValue(of([]));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({} as any);


    await TestBed.configureTestingModule({
      imports: [CoursesPageComponent],
      providers: [
        { provide: CoursesService, useValue: courseServiceSpy },

        { provide: MatDialog, useValue: dialogSpy},

        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },

        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .overrideProvider(MatDialog, { useValue: dialogSpy })
    .overrideProvider(MatSnackBar, { useValue: { open: jasmine.createSpy('open') } })
    .compileComponents();

   fixture = TestBed.createComponent(CoursesPageComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
  });

  it ('should load courses successfully', () => {
    const mockCourses: Course[] = [
      { _id: '1', name: 'Angular Basics', category: 'Front-End' },
      { _id: '2', name: 'Spring Boot', category: 'Back-End'},
      { _id: '3', name: 'HTML', category: 'Front-End'},
      { _id: '4', name: 'Java', category: 'Back-End'}
    ]

    courseServiceSpy.list.and.returnValue(of(mockCourses));

    fixture = TestBed.createComponent(CoursesPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();  // triggers ngOnInit → refresh()

    component.courses$?.subscribe(courses => {
      expect(courses).toEqual(mockCourses);
    });

    expect(courseServiceSpy.list).toHaveBeenCalled();
  });

  it('should open error dialog and return empty list on error', () => {
    courseServiceSpy.list.and.returnValue(
      throwError(() => new Error('error'))
    );

    fixture = TestBed.createComponent(CoursesPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // triggers ngOnInit → refresh()

    expect(dialogSpy.open).toHaveBeenCalled();

    component.courses$?.subscribe(courses => {
      expect(courses).toEqual([]);
    });
  });

  it('should navigate to new course page on add', () => {
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    const route = TestBed.inject(ActivatedRoute);

    component.onAdd();

    expect(router.navigate).toHaveBeenCalledWith(['new'], {relativeTo: route});
  })

  it('should navigate to edit course page on edit', () => {
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    const route = TestBed.inject(ActivatedRoute);

    const course: Course = {
      _id: '1',
      name: 'Angular Basics',
      category: 'Front-End'
    };

    component.onEdit(course);

    expect(router.navigate).toHaveBeenCalledWith(['edit', '1'], {relativeTo: route});
  });


  it('should delete a course when user confirms deletion', () => {
    const course: Course = {
      _id: '1',
      name: 'Angular',
      category: 'Front-End'
    };

    const userConfirmed = true;

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(userConfirmed)
    } as any);

    courseServiceSpy.remove.and.returnValue(of(void 0));

    spyOn(component, 'refresh');

    const snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    component.onDelete(course);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(courseServiceSpy.remove).toHaveBeenCalledWith('1');
    expect(component.refresh).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Course removed successfully!',
      'x',
      jasmine.any(Object)
    );
  });

  it('should NOT delete course when user cancels deletion', () => {
    const course: Course = {
      _id: '1',
      name: 'Angular',
      category: 'Front-End'
    };

    const userConfirmed = false;

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(userConfirmed)
    } as any);

    courseServiceSpy.remove.and.returnValue(of(void 0));

    spyOn(component, 'refresh');

    const snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    component.onDelete(course);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(courseServiceSpy.remove).not.toHaveBeenCalled;
    expect(component.refresh).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('should open error dialog when delete fails after user confirmation', () => {
    const course: Course = {
      _id: '1',
      name: 'Angular',
      category: 'Front-End'
    };

    const userConfirmed = true;

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(userConfirmed)
    } as any);

    courseServiceSpy.remove.and.returnValue(
      throwError(() => new Error('error'))
    );

    spyOn(component, 'refresh');

    const snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    component.onDelete(course);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(courseServiceSpy.remove).toHaveBeenCalledWith('1');
    expect(component.refresh).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(
      ErrorDialogComponent,
      {data: 'The course cannot be removed!'}
    );
  });

  it('should show loading spinner when courses are not loaded yet', () => {
    component.courses$ = null;

    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should pass courses to course-list component', () => {
    const mockCourses: Course[] = [
      { _id: '1', name: 'Angular Basics', category: 'Front-End' },
      { _id: '2', name: 'Spring Boot', category: 'Back-End'},
      { _id: '3', name: 'HTML', category: 'Front-End'},
      { _id: '4', name: 'Java', category: 'Back-End'}
    ]

    component.courses$ = of(mockCourses);
    fixture.detectChanges();

    const courseList = fixture.debugElement.query(By.css('app-course-list'));
    expect(courseList.componentInstance.courses).toEqual(mockCourses);
  });

  it('should call onAdd when child emits add event', () => {
    spyOn(component, 'onAdd');

    const courseList = fixture.debugElement.query(By.css('app-course-list'));

    courseList.componentInstance.add.emit();

    expect(component.onAdd).toHaveBeenCalled();
  });

  it('should call onEdit when child emits edit event', () => {
    const course: Course =  {
      _id: '1',
      name: 'Angular Basics',
      category: 'Front-End'
    };

    spyOn(component, 'onEdit');

    const courseList = fixture.debugElement.query(By.css('app-course-list'));

    courseList.componentInstance.edit.emit(course);

    expect(component.onEdit).toHaveBeenCalledWith(course);
  });

  it('should call onDelete when child emits delete event', () => {
    const course: Course =  {
      _id: '1',
      name: 'Angular Basics',
      category: 'Front-End'
    };

    spyOn(component, 'onDelete');

    const courseList = fixture.debugElement.query(By.css('app-course-list'));

    courseList.componentInstance.delete.emit(course);

    expect(component.onDelete).toHaveBeenCalledWith(course);
  });

});
