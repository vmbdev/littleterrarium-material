import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { ApiService, PlantGetConfig, PlantUpdateConfig } from '@services/api.service';
import { PhotoService } from '@services/photo.service';
import { Photo } from '@models/photo.model';
import { Condition, Plant } from '@models/plant.model';
import { ImagePathService } from './image-path.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  plant$: BehaviorSubject<Plant | null> = new BehaviorSubject<Plant | null>(null);
  owned: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private photoService: PhotoService,
    private imagePath: ImagePathService,
    private translate: TranslateService
  ) { }

  create(plant: Plant): Observable<Plant> {
    return this.api.createPlant(plant);
  }

  get(id: number, options?: PlantGetConfig): Observable<Plant> {
    return this.api.getPlant(id, options).pipe(
      map((plant: Plant) => {
        this.owned = (this.auth.user$.getValue()?.id === plant.ownerId);
        plant.visibleName = this.getVisibleName(plant);

        this.plant$.next(plant);

        return plant;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  getMany(options: any): Observable<Plant[]> {
    return this.api.getPlants(options).pipe(
      map((plants: Plant[]) => {
        for (const plant of plants) {
          plant.visibleName = this.getVisibleName(plant);
        }

        return plants;
      })
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
    else if (plant.specie?.name) name = plant.specie.name.slice(0,1).toUpperCase() + plant.specie.name.slice(1);
    else name = this.translate.instant('general.unnamedPlant', { plantId: plant.id });

    return name;
  }

  update(plant: Plant, options: PlantUpdateConfig = {}): Observable<Plant> {
    if (plant.specieId === null) options.removeSpecie = true;
    
    return this.api.updatePlant(plant, options).pipe(
      map((plant: Plant) => {
        const current = this.plant$.getValue();
        plant.visibleName = this.getVisibleName(plant);

        if (current) {
          plant.photos = current.photos;
          this.plant$.next(plant);
        }

        return plant;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  delete(id?: number): Observable<any> {
    if (!id) id = this.plant$.getValue()?.id;

    if (id) return this.api.deletePlant(id);
    else return EMPTY;
  }

  fertilize(id?: number): Observable<any> {
    let plantId: number | undefined;

    if (id) plantId = id;
    else plantId = this.plant$.getValue()?.id;

    if (plantId) {
      const updatedPlant = {
        id: plantId,
        fertLast: new Date()
      } as Plant;
      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  water(id?: number): Observable<any> {
    let plantId: number | undefined;

    if (id) plantId = id;
    else plantId = this.plant$.getValue()?.id;

    if (plantId) {
      const updatedPlant = {
        id: plantId,
        waterLast: new Date()
      } as Plant;
      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  coverPhoto(plant?: Plant): string {
    let workingPlant;

    if (!plant) workingPlant = this.plant$.getValue();
    else workingPlant = plant;

    if (workingPlant) {
      let image: any;

      if (workingPlant.cover) image = this.imagePath.get(workingPlant.cover.images, 'thumb');
      else if (workingPlant.photos && workingPlant.photos[0] && workingPlant.photos[0].images) {
        image = this.imagePath.get(workingPlant.photos[0].images, 'thumb');
      }
      else image = 'assets/nopic.png';

      return image;
    }
    else return 'assets/nopic.png';
  }

  getConditionColor(condition: Condition): string {
    let color: string;

    switch(condition) {
      case 'BAD': {
        color = 'red';
        break;
      }
      case 'POOR': {
        color = 'yellow';
        break;
      }
      case 'GOOD': {
        color = 'grey';
        break;
      }
      case 'GREAT': {
        color = 'greenyellow';
        break;
      }
      case 'EXCELLENT':
      default: {
        color = 'green';
        break;
      }
    }

    return color;
  }
}
