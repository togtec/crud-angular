import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListComponent } from './course-list.component';
import { Course } from '../../model/course';

fdescribe('CourseList', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  const mockCourses: Course[] = [
   { _id: '1', name: 'Angular Basics', category: 'Front-End' },
   { _id: '2', name: 'Spring Boot', category: 'Back-End'},
   { _id: '3', name: 'HTML', category: 'Front-End'},
   { _id: '4', name: 'Java', category: 'Back-End'}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the courses received as input', () => {
    component.courses = mockCourses;
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;

    expect(html.textContent).toContain('Angular Basics');
    expect(html.textContent).toContain('Spring Boot');
    expect(html.textContent).toContain('HTML');
    expect(html.textContent).toContain('Java');

    const rows = html.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(4);
  });

  it('should emit add event when Add button is clicked', () => {
    spyOn(component.add, 'emit');

    const button = fixture.nativeElement.querySelector('button[aria-label="Add Course"]');

    button.click();

    expect(component.add.emit).toHaveBeenCalled();
  });

  it('should emit edit event with selected course when Edit button is clicked', () => {
    spyOn(component.edit, 'emit');

    component.courses = mockCourses;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label="Edit Course"]');

    expect(buttons.length).toBe(4);

    buttons[2].click();

    expect(component.edit.emit).toHaveBeenCalledWith(mockCourses[2]);
  });

  it('should emit delete event with selected course when Delete button is clicked', () => {
    spyOn(component.delete, 'emit');

    component.courses = mockCourses;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label="Remove Course"]');

    expect(buttons.length).toBe(4);

    buttons[2].click();

    expect(component.delete.emit).toHaveBeenCalledWith(mockCourses[2]);
  });

});
