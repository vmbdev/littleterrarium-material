import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { finalize, map, take } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { FabComponent } from '@components/fab/fab.component';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { LocationEditComponent } from '@components/location/location-edit/location-edit.component';
import { ImageGeneratorComponent } from '@components/image-generator/image-generator.component';
import { LocationService } from '@services/location/location.service';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';
import { AuthService } from '@services/auth/auth.service';
import { LocationGetConfig } from '@services/api/api.service';
import { Location } from '@models/location.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'ltm-location-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    TranslocoModule,
    FabComponent,
    WaitDialogComponent,
    ImageGeneratorComponent,
    ImagePathPipe,
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationListComponent {
  private readonly auth = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly translate = inject(TranslocoService);
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);

  userId = input<number>();

  protected owned: boolean = true;
  protected readonly $locations = signal<Location[]>([]);

  ngOnInit(): void {
    const userId = this.userId();

    if (userId) {
      this.owned = this.auth.isSameUser('id', userId);
    }

    this.getLocationList();
  }

  getLocationList() {
    const wd = this.openWaitDialog();
    const options: LocationGetConfig = {
      plantCount: true,
      userId: this.userId(),
    };

    this.locationService
      .getMany(options)
      .pipe(
        take(1),
        map((list) => {
          return list.map((location) => ({
            ...location,
            lightAsset: this.locationService.getLightAsset(location.light),
            lightName: this.locationService.getLightName(location.light),
          }))
        }),
        finalize(() => {
          wd.close();
        }),
      )
      .subscribe((res) => {
        this.$locations.set(res);
      });
  }

  openEdit(location: Location): void {
    const bsRef = this.bottomSheet.open(LocationEditComponent, {
      data: location,
    });

    bsRef.afterDismissed().subscribe((updatedLocation: Location) => {
      if (updatedLocation) {
        const finalLocation = { 
          ...updatedLocation,
        };

        this.$locations.update((val) => {
          const newList = [...val];
          const index = newList.findIndex(
            (loc) => loc.id === updatedLocation.id,
          );
          const plantCount = newList[index]._count?.plants;

          if (plantCount) finalLocation._count = { plants: plantCount };

          newList[index] = finalLocation;

          return newList;
        });
      }
    });
  }

  selectLocation(id: number) {
    this.router.navigate(['location', id]);
  }

  openRemoveDialog(name: string, id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: name,
        question: [this.translate.translate('location.remove')],
        accept: () => {
          this.delete(id);
        },
      },
    });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('general.loading'),
        progressBar: false,
      },
    });
  }

  delete(id: number) {
    this.locationService.delete(id).subscribe({
      next: () => {
        this.$locations.update((val) => {
          const newList = [...val];
          const index = newList.findIndex((loc) => loc.id === id);

          newList.splice(index, 1);

          return newList;
        });
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') {
          this.errorHandler.push(this.translate.translate('location.invalid'));
        }
      },
    });
  }

  stopPropagation(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
