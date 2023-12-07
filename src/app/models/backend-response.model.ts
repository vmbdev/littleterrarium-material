import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';
import { Specie } from '@models/specie.model';
import { User } from '@models/user.model';
import { Location } from '@models/location.model';

export type NavigationData = {
  prev?: {
    id: number;
  };
  next?: {
    id: number;
  };
};

export interface BackendResponse {
  msg?: string;
  code?: number;
  data?: {
    photo?: Photo;
    photos?: Photo[];
    location?: Location;
    locations?: Location[];
    user?: User;
    users?: User[];
    plant?: Plant;
    plants?: Plant[];
    specie?: Specie;
    species?: Specie[];
    plantId?: number;
    navigation?: NavigationData;
    plantCoverId: number;
  };
  errorData?: {
    field?: string;
    values?: any[];
    comp?: any;
  };
}
