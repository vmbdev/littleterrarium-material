import { Inject, Injectable } from '@angular/core';
import { BACKEND_URL } from 'src/tokens';

export interface ImageSize {
  [key: string]: string;
  full: string;
  mid: string;
  thumb: string;
}

export interface ImagePath {
  path: ImageSize;
  webp?: ImageSize;
}

@Injectable({
  providedIn: 'root',
})
export class ImagePathService {
  constructor(@Inject(BACKEND_URL) public backendUrl: string) {}

  get(image: ImagePath, size: 'thumb' | 'mid' | 'full'): string | null {
    let path: string | null = null;

    if (image.webp) path = image.webp[size];
    else if (image.path) path = image.path[size];

    if (!path) return null;
    else return `${this.backendUrl}/${path}`;
  }

  // TODO: detect webp support and offer the choice to the browser
}
