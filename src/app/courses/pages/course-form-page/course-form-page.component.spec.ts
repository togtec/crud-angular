import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFormPageComponent } from './course-form-page.component.js';

describe('CoursesPageComponent', () => {
  let component: CourseFormPageComponent;
  let fixture: ComponentFixture<CourseFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
