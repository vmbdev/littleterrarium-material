import { Pipe, PipeTransform } from '@angular/core';
import { SortOptions } from '@models/sort-options.model';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(value: any[], param: string, order: SortOptions, caseSensitive: boolean = false): any[] {
    return value.sort((a, b) => {
      let aParam, bParam;

      if (a[param]) aParam = a[param];
      else if (a.sortableOptions[param]) aParam = a.sortableOptions[param];

      if (b[param]) bParam = b[param];
      else if (b.sortableOptions[param]) bParam = b.sortableOptions[param];

      if (!aParam || !bParam) return 0;

      if (!caseSensitive) {
        aParam = (aParam as string).toLowerCase();
        bParam = (bParam as string).toLowerCase();
      }

      if (order === 'asc') return ((aParam < bParam) ? -1 : 1);
      else return ((aParam > bParam) ? -1 : 1);
    });
  }
}
