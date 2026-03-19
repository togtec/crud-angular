import { Component, inject, Input } from '@angular/core';
import { materialImports } from '../../shared/material/material.imports';
import { CategoryPipe } from '../../shared/pipes/category-pipe';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [materialImports, CategoryPipe],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseListComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly displayedColumns = ['_id', 'name', 'category', 'actions'];
  @Input() courses: Course[] = [];

  onAdd() {
    //console.log('onAdd');
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
