import { Plant } from '@models/plant.model';
import { ImagePath } from './image-path.model';

export interface Location {
  id: number;
  name: string;
  light: Light;
  public: boolean;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  plants?: Plant[];
  _count?: {
    plants: number;
  };
  pictureFile: File;
  pictures?: ImagePath;
}

export enum Light {
  FULLSUN = 'FULLSUN',
  PARTIALSUN = 'PARTIALSUN',
  SHADE = 'SHADE',
}
