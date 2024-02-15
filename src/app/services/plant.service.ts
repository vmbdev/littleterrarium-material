import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import {
  ApiService,
  PlantGetConfig,
  PlantUpdateConfig,
} from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';
import { Photo } from '@models/photo.model';
import { Condition, Plant, Pot } from '@models/plant.model';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private plant = new BehaviorSubject<Plant | null>(null);
  public readonly plant$ = this.plant.asObservable();
  private owned = new BehaviorSubject<boolean>(false);
  public readonly owned$ = this.owned.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly auth: AuthService,
    private readonly imagePath: ImagePathService,
    private readonly translate: TranslocoService,
  ) {}

  create(plant: Plant): Observable<Plant> {
    return this.api.createPlant(plant);
  }

  get(id: number, options?: PlantGetConfig): Observable<Plant> {
    this.plant.next(null);

    return this.api.getPlant(id, options).pipe(
      map((plant: Plant) => {
        const newPlant = { ...plant };

        this.owned.next(this.auth.getUser()?.id === newPlant.ownerId);
        newPlant.visibleName = this.getVisibleName(newPlant);

        this.plant.next(newPlant);

        return newPlant;
      }),
    );
  }

  getMany(options: PlantGetConfig): Observable<Plant[]> {
    return this.api.getPlants(options).pipe(
      map((plants: Plant[]) => {
        const newPlants = [];

        for (const plant of plants) {
          const newPlant = { ...plant };

          newPlant.visibleName = this.getVisibleName(newPlant);
          newPlants.push(newPlant);
        }

        return newPlants;
      }),
    );
  }

  getCover(id: number): Observable<any> {
    return this.api.getPlantCover(id);
  }

  getPhotos(id: number): Observable<Photo[]> {
    return this.api.getPlantPhotos(id);
  }

  getVisibleName(plant: Plant): string {
    let name;

    if (plant.customName) name = plant.customName;
    else if (plant.specie?.name) {
      name =
        plant.specie.name.slice(0, 1).toUpperCase() +
        plant.specie.name.slice(1);
    } else {
      name = this.translate.translate('general.unnamedPlant', {
        plantId: plant.id,
      });
    }

    return name;
  }

  count(): Observable<number> {
    return this.api.countPlants();
  }

  update(plant: Plant, options: PlantUpdateConfig = {}): Observable<Plant> {
    if (plant.specieId === null) options.removeSpecie = true;

    return this.api.updatePlant(plant, options).pipe(
      map((plant: Plant) => {
        const newPlant = { ...plant };
        const current = this.plant.getValue();
        newPlant.visibleName = this.getVisibleName(newPlant);

        if (current) {
          newPlant.photos = current.photos;
          this.plant.next(newPlant);
        }

        return newPlant;
      }),
    );
  }

  delete(id?: number): Observable<any> {
    if (!id) id = this.plant.getValue()?.id;

    if (id) {
      this.plant.next(null);
      return this.api.deletePlant(id);
    } else return EMPTY;
  }

  fertilize(id?: number): Observable<any> {
    let plantId: number | undefined;

    if (id) plantId = id;
    else plantId = this.plant.getValue()?.id;

    if (plantId) {
      const updatedPlant = {
        id: plantId,
        fertLast: new Date(),
      } as Plant;

      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  water(id?: number): Observable<any> {
    let plantId: number | undefined;

    if (id) plantId = id;
    else plantId = this.plant.getValue()?.id;

    if (plantId) {
      const updatedPlant = {
        id: plantId,
        waterLast: new Date(),
      } as Plant;

      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  current(): Plant | null {
    return this.plant.getValue();
  }

  empty(): void {
    this.plant.next(null);
    this.owned.next(false);
  }

  coverPhoto(plant?: Plant): string {
    let workingPlant;

    if (!plant) workingPlant = this.plant.getValue();
    else workingPlant = plant;

    if (workingPlant) {
      let image: any;

      if (workingPlant.cover) {
        image = this.imagePath.get(workingPlant.cover.images, 'thumb');
      } else if (
        workingPlant.photos &&
        workingPlant.photos[0] &&
        workingPlant.photos[0].images
      ) {
        image = this.imagePath.get(workingPlant.photos[0].images, 'thumb');
      } else image = 'assets/nopic.png';

      return image;
    } else return 'assets/nopic.png';
  }

  getPotInfo(key: string): Pot {
    let pot: Pot;

    switch (key) {
      case 'LT_POT_TERRACOTTA': {
        pot = {
          name: 'potMaterial.terracotta',
          image: 'assets/pot-terracotta.jpg',
        };
        break;
      }
      case 'LT_POT_PLASTIC': {
        pot = {
          name: 'potMaterial.plastic',
          image: 'assets/pot-plastic.jpg',
        };
        break;
      }
      case 'LT_POT_CERAMIC': {
        pot = {
          name: 'potMaterial.ceramic',
          image: 'assets/pot-ceramic.jpg',
        };
        break;
      }
      case 'LT_POT_METAL': {
        pot = {
          name: 'potMaterial.metal',
          image: 'assets/pot-metal.jpg',
        };
        break;
      }
      case 'LT_POT_GLASS': {
        pot = {
          name: 'potMaterial.glass',
          image: 'assets/pot-glass.jpg',
        };
        break;
      }
      case 'LT_POT_WOOD': {
        pot = {
          name: 'potMaterial.wood',
          image: 'assets/pot-wood.jpg',
        };
        break;
      }
      case 'LT_POT_CONCRETE': {
        pot = {
          name: 'potMaterial.concrete',
          image: 'assets/pot-concrete.jpg',
        };
        break;
      }
      default: {
        pot = {
          name: 'potMaterial.other',
          image: 'assets/pot-other.jpg',
        };
        break;
      }
    }

    return pot;
  }

  getConditionDesc(condition: Condition | string): string {
    let desc: string;

    switch (condition) {
      case 'BAD': {
        desc = 'condition.bad';
        break;
      }
      case 'POOR': {
        desc = 'condition.poor';
        break;
      }
      case 'GREAT': {
        desc = 'condition.great';
        break;
      }
      case 'EXCELLENT': {
        desc = 'condition.excellent';
        break;
      }
      default:
      case 'GOOD': {
        desc = 'condition.good';
        break;
      }
    }
    return desc;
  }

  getConditionColor(condition: Condition | string): string {
    let color: string;

    switch (condition) {
      case 'BAD':
        color = 'red';
        break;
      case 'POOR':
        color = 'yellow';
        break;
      case 'GREAT':
        color = 'greenyellow';
        break;
      case 'EXCELLENT':
        color = 'green';
        break;
      default:
        color = 'grey';
        break;
    }

    return color;
  }
}
