import { Pipe, PipeTransform, inject } from '@angular/core';

import { ImagePath } from '@models/image-path.model';
import { ImagePathService } from '@services/image-path/image-path.service';

@Pipe({
  name: 'imagePath',
  standalone: true
})
export class ImagePathPipe implements PipeTransform {
  private readonly imagePathService = inject(ImagePathService);

  transform(value: ImagePath, size: 'thumb' | 'mid' | 'full'): string | null {
    return this.imagePathService.get(value, size);
  }
}
