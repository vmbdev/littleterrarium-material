import { Photo } from '@models/photo.model';
import { Specie } from '@models/specie.model';

export interface Plant {
  id: number;
  specieId: number | null;
  customName: string | null;
  description: string | null;
  condition: Condition | null;
  waterFreq: number | null;
  waterLast: Date | null;
  waterNext: Date | null;
  fertFreq: number | null;
  fertLast: Date | null;
  fertType: string | null;
  fertNext: Date | null;
  potType: string | null;
  potSize: number | null;
  soil: string | null;
  public: boolean;
  coverId?: number | null;
  locationId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  cover?: Photo;
  photos?: Photo[];
  specie?: Specie;
  visibleName?: string;
}

export interface CoverPhoto {
  coverId: number | null;
}

export type Pot = {
  name: string;
  image: string;
};

export enum Condition {
  BAD = 'BAD',
  POOR = 'POOR',
  GOOD = 'GOOD',
  GREAT = 'GREAT',
  EXCELLENT = 'EXCELLENT',
}

export enum PotNames {
  LT_POT_TERRACOTTA = 'LT_POT_TERRACOTTA',
  LT_POT_PLASTIC = 'LT_POT_PLASTIC',
  LT_POT_CERAMIC = 'LT_POT_CERAMIC',
  LT_POT_METAL = 'LT_POT_METAL',
  LT_POT_GLASS = 'LT_POT_GLASS',
  LT_POT_WOOD = 'LT_POT_WOOD',
  LT_POT_CONCRETE = 'LT_POT_CONCRETE',
  LT_POT_OTHER = 'LT_POT_OTHER',
}
