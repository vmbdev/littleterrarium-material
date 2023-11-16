import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortFilename',
  standalone: true
})
export class ShortFilenamePipe implements PipeTransform {

  transform(value: string, length: number): string {
    if (value.length <= length) return value;

    else {
      const name = value.split('.');
      const ext = name.pop();
      const filename = name.join('.');

      const res = 
        `${filename.slice(0, length / 2)}...${filename.slice(-(length / 2))}.${ext}`;

      return res;
    }
  }

}
