import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { FabComponent } from '@components/fab/fab.component';
import {
  ConfirmDialogComponent
} from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  LocationEditComponent
} from '@components/location/location-edit/location-edit.component';
import { LocationService } from '@services/location.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { AuthService } from '@services/auth.service';
import { LocationGetConfig } from '@services/api.service';
import { ImagePath, ImagePathService } from '@services/image-path.service';
import { User } from '@models/user.model';
import { Location } from '@models/location.model';

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
    TranslocoModule,
    FabComponent,
    WaitDialogComponent,
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent {
  @Input() user?: User;
  owned: boolean = true;
  locations$ = new BehaviorSubject<Location[]>([]);

  constructor(
    private auth: AuthService,
    private locationService: LocationService,
    private imagePath: ImagePathService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private translate: TranslocoService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    if (this.user?.id) {
      this.owned = this.auth.isSameUser('id', this.user.id);
    }

    this.getLocationList();
  }

  getLocationList() {
    const wd = this.openWaitDialog();

    const options: LocationGetConfig = {
      plantCount: true,
      userId: this.user?.id,
    };

    const obs = this.locationService.getMany(options).pipe(
      finalize(() => {
        wd.close();
      })
    );

    obs.subscribe((res) => {
      this.locations$.next(res);
    });
  }

  openEdit(id: number): void {
    const bsRef = this.bottomSheet.open(LocationEditComponent, {
      data: { id },
    });

    bsRef.afterDismissed().subscribe((updatedLocation: Location) => {
      if (updatedLocation) {
        const list = this.locations$.getValue();
        const index = list.findIndex((loc) => loc.id === updatedLocation.id);
        const plantCount = list[index]._count?.plants;

        if (plantCount) updatedLocation._count = { plants: plantCount };

        list[index] = updatedLocation;
        this.locations$.next(list);
      }
    });
  }

  selectLocation(id: number) {
    this.router.navigate(['location', id]);
  }

  getHeaderPic(images: ImagePath): string | null {
    return this.imagePath.get(images, 'thumb');
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
        this.getLocationList();
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') {
          this.translate.selectTranslate('location.invalid').subscribe((res: string) => {
            this.errorHandler.push(res);
          });
        }
      },
    });
  }
}
