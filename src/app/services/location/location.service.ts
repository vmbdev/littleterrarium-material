import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import {
  ApiService,
  LocationGetConfig,
  LocationUpsertConfig,
  PlantGetConfig,
} from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { PlantService } from '@services/plant/plant.service';
import { Light, Location } from '@models/location.model';
import { Plant } from '@models/plant.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly translate = inject(TranslocoService);
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly plantService = inject(PlantService);

  readonly #$location: WritableSignal<Location | null> = signal(null);
  public readonly $location = this.#$location.asReadonly();
  readonly #$owned: WritableSignal<boolean> = signal(false);
  public readonly $owned = this.#$owned.asReadonly();

  create(location: Location): Observable<Location> {
    this.#$location.set(null);

    return this.api.createLocation(location).pipe(
      tap((location: Location) => {
        this.#$location.set(location);
      })
    );
  }

  get(id: number, options?: LocationGetConfig): Observable<Location> {
    this.#$location.set(null);

    return this.api.getLocation(id, options).pipe(
      tap((location: Location) => {
        this.#$owned.set(this.auth.getUser()?.id === location.ownerId);
        this.#$location.set(location);
      }),
      catchError((err: HttpErrorResponse) => {
        this.#$location.set(null);
        this.#$owned.set(false);
        return throwError(() => err);
      })
    );
  }

  getMany(options?: LocationGetConfig): Observable<Location[]> {
    return this.api.getLocationList(options);
  }

  getPlants(id: number, options?: PlantGetConfig): Observable<Plant[]> {
    return this.api.getLocationPlants(id, options).pipe(
      map((plants: Plant[]) => {
        const newPlants = [];

        for (const plant of plants) {
          const newPlant = { ...plant };

          newPlant.visibleName = this.plantService.getVisibleName(newPlant);
          newPlants.push(newPlant);
        }

        return newPlants;
      })
    );
  }

  countPlants(id: number): Observable<number> {
    return this.api.countLocationPlants(id);
  }

  update(
    location: Location,
    options?: LocationUpsertConfig
  ): Observable<Location> {
    return this.api.updateLocation(location, options).pipe(
      tap((updatedLocation: Location) => {
        this.#$location.set(updatedLocation);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.api.deleteLocation(id).pipe(
      tap(() => {
        this.#$location.set(null);
      })
    );
  }

  empty(): void {
    this.#$location.set(null);
    this.#$owned.set(false);
  }

  getLightName(light: string): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = 'light.fullsun';
        break;
      }
      case 'PARTIALSUN': {
        desc = 'light.partialsun';
        break;
      }
      default: {
        desc = 'light.shade';
        break;
      }
    }

    return desc;
  }

  getLightDesc(light: string | Light): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = 'light.fullsunDesc';
        break;
      }
      case 'PARTIALSUN': {
        desc = 'light.partialsunDesc';
        break;
      }
      default: {
        desc = 'light.shadeDesc';
        break;
      }
    }

    return desc;
  }

  getLightAsset(light: string | Light): string {
    let icon: string;

    if (light === 'FULLSUN') icon = 'brightness_7';
    else if (light === 'PARTIALSUN') icon = 'brightness_6';
    else icon = 'brightness_5';

    return icon;
  }

  openUploadDialog(): MatDialogRef<WaitDialogComponent, any> {
    return this.dialog.open(WaitDialogComponent, {
      data: {
        message: this.translate.translate('progress-bar.uploading'),
        progressBar: true,
        progressValue: signal(0),
        finalMessage: this.translate.translate('general.afterUpload'),
      },
    });
  }
}
