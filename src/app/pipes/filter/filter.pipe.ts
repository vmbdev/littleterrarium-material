import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field?: string, text?: string): any[] {
    if (!field || !text) return items;

    return items.filter((item: any) =>
      item[field].toLowerCase().includes(text.toLowerCase())
    );
  }
}
