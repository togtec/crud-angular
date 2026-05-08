import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category',
  standalone: true
})
export class CategoryPipe implements PipeTransform {

  transform(value: string): string {
    const normalizedValue = value.trim().toLowerCase();

    switch(normalizedValue) {
      case 'front-end':
        return 'code';

      case 'back-end':
        return 'computer';

    }

    return 'error';
  }

}
