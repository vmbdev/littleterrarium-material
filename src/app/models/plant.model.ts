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
  coverId?: number;
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

export const Condition: { [key: string]: string } = {
  BAD: 'On the line', // red
  POOR: 'Holding on to life', // yellow
  GOOD: 'Looks good', // grey
  GREAT: 'Looks great', // light green
  EXCELLENT: 'Prime example of its specie', // vibrant green
};
export type Condition = (typeof Condition)[keyof typeof Condition];

export type Pot = {
  name: string;
  image: string;
};
// client-side only
export const potChoices: { [key: string]: Pot } = {
  LT_POT_TERRACOTTA: { name: 'Terracotta', image: 'assets/pot-terracotta.jpg' },
  LT_POT_PLASTIC: { name: 'Plastic', image: 'assets/pot-plastic.jpg' },
  LT_POT_CERAMIC: { name: 'Ceramic', image: 'assets/pot-ceramic.jpg' },
  LT_POT_METAL: { name: 'Metal', image: 'assets/pot-metal.jpg' },
  LT_POT_GLASS: { name: 'Glass', image: 'assets/pot-glass.jpg' },
  LT_POT_WOOD: { name: 'Wood', image: 'assets/pot-wood.jpg' },
  LT_POT_CONCRETE: { name: 'Concrete', image: 'assets/pot-concrete.jpg' },
  LT_POT_OTHER: { name: 'Other', image: 'assets/pot-other.jpg' },
};
