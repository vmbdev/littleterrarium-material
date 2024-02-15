import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { catchError, EMPTY } from 'rxjs';
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
import { Location } from '@models/location.model';

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
  protected lightAsset?: string;
  protected lightName?: string;

  constructor(
    public readonly locationService: LocationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mt: MainToolbarService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly translate: TranslocoService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly dialog: MatDialog,
  ) {
    // we listen to the service for updates
    // it's necessary if we update the location from the bottom sheet
    this.locationService.location$
      .pipe(takeUntilDestroyed())
      .subscribe((location: Location | null) => {
        if (location) {
          this.lightAsset = this.locationService.getLightAsset(location.light);
          this.lightName = this.locationService.getLightName(location.light);
          this.updateMainToolbar(location);
        }
      });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {
      this.locationService
        .get(this.id, { plantCount: true })
        .pipe(
          catchError((err: HttpErrorResponse) => {
            let msg: string;

            if (err.error?.msg === 'LOCATION_NOT_FOUND') {
              msg = 'location.invalid';
            } else msg = 'errors.server';

            this.translate.selectTranslate(msg).subscribe((res: string) => {
              this.errorHandler.push(res);
            });

            this.router.navigateByUrl('/');

            return EMPTY;
          }),
        )
        .subscribe((location: Location) => {});
    }
  }

  updateMainToolbar(location: Location): void {
    this.mt.setName(location.name);
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
            this.openRemoveDialog(location.id);
          },
        },
      ],
    ]);
  }

  openRemoveDialog(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.translate('general.delete'),
        question: [this.translate.translate('location.remove')],
        accept: () => {
          this.delete(id);
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
          this.translate
            .selectTranslate('location.invalid')
            .subscribe((res: string) => {
              this.errorHandler.push(res);
            });
        }
      },
    });
  }

  openEdit(): void {
    if (this.id) {
      this.bottomSheet.open(LocationEditComponent, {
        data: { id: this.id },
      });
    }
  }
}
