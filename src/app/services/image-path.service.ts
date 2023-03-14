import { Injectable } from '@angular/core';
import { ImagePath } from '@models/image-path.model';
import { baseUrl } from '@config';

@Injectable({
  providedIn: 'root'
})
export class ImagePathService {
  constructor() { }
  
  get(image: ImagePath, size: 'thumb' | 'mid' | 'full'): string | null {
    let path: string | null = null;
    
    if (image.webp) path = image.webp[size];
    else if (image.path) path = image.path[size];
    
    if (!path) return null;
    else return `${baseUrl}/${path}`
  }
  
  // TODO: detect webp support and offer the choice to the browser

}
