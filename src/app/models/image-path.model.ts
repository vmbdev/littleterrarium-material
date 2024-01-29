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
