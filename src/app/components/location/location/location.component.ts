import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { PropertyComponent } from '@components/info-box/property/property.component';
import { InfoBoxComponent } from '@components/info-box/info-box/info-box.component';
import { FabComponent } from '@components/fab/fab.component';
import { LocationEditComponent } from '@components/location/location-edit/location-edit.component';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'ltm-location',
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatDialogModule,
    TranslocoModule,
    PlantListComponent,
    PropertyComponent,
    InfoBoxComponent,
    FabComponent,
  ],
  templateUrl: './location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent {
  private id?: number;
  protected plantCount$?: Observable<number>;
  protected readonly $lightAsset: Signal<string | null> = computed(() => {
    const light = this.locationService.$location()?.light;

    return light ? this.locationService.getLightAsset(light) : null;
  });
  protected readonly $lightName: Signal<string | null> = computed(() => {
    const light = this.locationService.$location()?.light;

    return light ? this.locationService.getLightName(light) : null;
  });

  updateMtTitle = effect(() => {
    const loc = this.locationService.$location();

    untracked(() => {
      if (loc) this.mt.setName(loc.name);
    });
  });

  constructor(
    public readonly locationService: LocationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mt: MainToolbarService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly translate: TranslocoService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {
      this.plantCount$ = this.locationService.countPlants(this.id);
      this.locationService
        .get(this.id)
        .pipe(
          tap(() => {
            this.updateMainToolbar();
          }),
          catchError((err: HttpErrorResponse) => {
            let msg: string;

            if (err.error?.msg === 'LOCATION_NOT_FOUND') {
              msg = 'location.invalid';
            } else msg = 'errors.server';

            this.errorHandler.push(this.translate.translate(msg));
            this.router.navigateByUrl('/');

            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  updateMainToolbar(): void {
    this.mt.setButtons([]);
    this.mt.setMenu([
      [
        {
          icon: 'edit',
          tooltip: 'general.edit',
          click: () => {
            this.openEdit();
          },
        },
      ],
      [
        {
          icon: 'delete',
          tooltip: 'general.delete',
          click: () => {
            this.openRemoveDialog();
          },
        },
      ],
    ]);
  }

  openRemoveDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.translate('general.delete'),
        question: [this.translate.translate('location.remove')],
        accept: () => {
          if (this.id) {
            this.delete(this.id);
          }
        },
      },
    });
  }

  delete(id: number) {
    this.locationService.delete(id).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') {
          this.errorHandler.push(this.translate.translate('location.invalid'));
        }
      },
    });
  }

  openEdit(): void {
    const loc = this.locationService.$location();

    if (loc) {
      this.bottomSheet.open(LocationEditComponent, { data: loc });
    }
  }
}
