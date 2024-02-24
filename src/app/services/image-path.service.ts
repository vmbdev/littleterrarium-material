import { Inject, Injectable } from '@angular/core';

import { ImagePath } from '@models/image-path.model';
import { BACKEND_URL } from 'src/tokens';

@Injectable({
  providedIn: 'root',
})
export class ImagePathService {
  private webpEnabled: boolean = true;

  constructor(@Inject(BACKEND_URL) public readonly backendUrl: string) {
    this.detectWebPSupport();
  }

  get(image: ImagePath, size: 'thumb' | 'mid' | 'full'): string | null {
    let path: string | null = null;

    if (image.webp && this.webpEnabled) path = image.webp[size];
    else if (image.path) path = image.path[size];

    if (!path) return null;
    else return `${this.backendUrl}/${path}`;
  }

  /**
   * Create a WebP image and check if the browser can detect its dimensions.
   * If so, then the browser can render WebP images.
   */
  detectWebPSupport(): void {
    let img = new Image();

    img.src =
      'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';

    img.onload = () => {
      this.webpEnabled = img.width === 2 && img.height === 1;
    };
  }
}
