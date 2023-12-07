import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortFilename',
  standalone: true,
})
export class ShortFilenamePipe implements PipeTransform {
  transform(value: string, length: number): string {
    if (value.length <= length) return value;
    else {
      const filename = value.split('.');
      const ext = filename.pop();
      const basename = filename.join('.');

      const shortBaseName =
        `${basename.slice(0, length / 2)}...${basename.slice(-(length / 2))}`;
      const res = `${shortBaseName}.${ext}`;

      return res;
    }
  }
}
