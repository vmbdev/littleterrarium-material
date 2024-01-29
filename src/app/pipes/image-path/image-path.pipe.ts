import { Pipe, PipeTransform } from '@angular/core';
import { ImagePath } from '@models/image-path.model';
import { ImagePathService } from '@services/image-path.service';

@Pipe({
  name: 'imagePath',
  standalone: true
})
export class ImagePathPipe implements PipeTransform {
  constructor(private readonly imagePathService: ImagePathService) {}

  transform(value: ImagePath, size: 'thumb' | 'mid' | 'full'): string | null {
    return this.imagePathService.get(value, size);
  }

}
