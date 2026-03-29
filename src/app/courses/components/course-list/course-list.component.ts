import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { materialImports } from '../../../shared/material/material.imports';
import { CategoryPipe } from '../../../shared/pipes/category-pipe';
import { Course } from '../../model/course';


@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [materialImports, CategoryPipe],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent {

  readonly displayedColumns = ['_id', 'name', 'category', 'actions'];
  @Input() courses: Course[] = [];
  @Output() add = new EventEmitter<void>();

  onAdd() {
    this.add.emit();
  }
}
