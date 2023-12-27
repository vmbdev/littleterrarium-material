import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { catchError, EMPTY, finalize, Subscription, switchMap } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { DateTime } from 'luxon';

import {
  InfoBoxComponent
} from "@components/info-box/info-box/info-box.component";
import {
  PropertyComponent
} from "@components/info-box/property/property.component";
import {
  ToggleOptionComponent
} from '@components/toggle-option/toggle-option.component';
import {
  PhotoEditComponent
} from '@components/photo/photo-edit/photo-edit.component';
import { ViewerComponent } from '@components/viewer/viewer.component';
import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  ConfirmDialogComponent
} from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ImagePathService } from '@services/image-path.service';
import { ViewerService } from '@services/viewer.service';
import { Plant } from '@models/plant.model';
import { NavigationData, Photo } from '@models/photo.model';
import { DaysAgoPipe } from "@pipes/days-ago/days-ago.pipe";
import { ShareService } from '@services/share.service';

@Component({
  selector: 'ltm-photo',
  standalone: true,
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatCardModule,
    MatIconModule,
    TranslocoModule,
    InfoBoxComponent,
    PropertyComponent,
    ToggleOptionComponent,
    ViewerComponent,
    DaysAgoPipe,
  ],
})
export class PhotoComponent {
  id?: number;
  confirmDelete: boolean = false;
  enablePhotoEditing: boolean = false;
  navigation: NavigationData = {};
  plantCoverId?: number;
  currentImageFull?: string | null;
  coverChecked: boolean = false;
  touchEvents: any;

  routeDetect$?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly photoService: PhotoService,
    private readonly plantService: PlantService,
    private readonly errorHandler: ErrorHandlerService,
    public readonly imagePath: ImagePathService,
    private readonly translate: TranslocoService,
    private readonly mt: MainToolbarService,
    private readonly dialog: MatDialog,
    private readonly bottomSheet: MatBottomSheet,
    private readonly viewer: ViewerService,
    private readonly share: ShareService,
  ) {}

  ngOnInit(): void {
    this.setMtMenus();

    // Angular doesn't update a component when the route only changes its
    // parameters, so we need to do it when navigating the previous/next photo
    this.routeDetect$ = this.route.params.subscribe((param: Params) => {
      this.id = param['photoId'];
      this.loadPhoto();
    });
  }

  loadNextPhoto() {
    if (this.navigation.next) {
      this.router.navigate(['/photo', this.navigation.next.id], {
        replaceUrl: true,
      });
    }
  }

  loadPrevPhoto() {
    if (this.navigation.prev) {
      this.router.navigate(['/photo', this.navigation.prev.id], {
        replaceUrl: true,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routeDetect$) this.routeDetect$.unsubscribe();
  }

  loadPhoto(): void {
    if (this.id) {
      const wd = this.openWaitDialog();

      this.navigation = {};

      this.photoService
        .get(this.id, { navigation: true, cover: true })
        .pipe(
          finalize(() => {
            wd.close();
          }),
          catchError((err: HttpErrorResponse) => {
            let msg: string;

            if (err.error?.msg === 'PHOTO_NOT_FOUND') msg = 'photo.invalid';
            else msg = 'errors.server';

            this.translate.selectTranslate(msg).subscribe((res: string) => {
              this.errorHandler.push(res);
            });

            this.router.navigateByUrl('/');

            return EMPTY;
          }),
          switchMap((photo: Photo) => {
            this.currentImageFull = this.imagePath.get(photo.images, 'full');
            this.mt.setName(this.getDateTitle(photo.takenAt));

            return this.photoService.getNavigation(photo.id);
          }),
          switchMap((navigation: NavigationData) => {
            this.navigation = navigation;
            const photo = this.photoService.photo$.getValue();

            if (photo?.plantId) {
              return this.plantService.getCover(photo.plantId);
            } else return EMPTY;
          })
        )
        .subscribe((cover: any) => {
          this.plantCoverId = cover.coverId;
        });
    }
  }

  setMtMenus(): void {
    this.mt.setMenu([
      [
        {
          icon: 'share',
          tooltip: 'general.share',
          click: () => {
            this.sharePhoto();
          },
        },
      ],
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
    this.mt.setButtons([]);
  }

  async sharePhoto() {
    if (this.currentImageFull) {
      this.share.shareImageFromURL(this.currentImageFull).subscribe();
    }
  }

  toggleViewer() {
    if (this.currentImageFull) {
      this.viewer.create(this.currentImageFull);
    }
  }

  openRemoveDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.translate('general.delete'),
        question: [this.translate.translate('photo.remove')],
        accept: () => {
          this.delete();
        },
      },
    });
  }

  delete(): void {
    const photo = this.photoService.photo$.getValue();
    if (photo) {
      this.photoService.delete(photo.id).subscribe(() => {
        this.router.navigate(['/plant', photo.plantId]);
      });
    }
  }

  getDateTitle(date: string | Date): string {
    const d = date.toString();
    const dateDiff = DateTime.fromISO(d).diffNow('days').days;
    const numberOfDays = Math.abs(Math.ceil(dateDiff)).toString();

    return this.translate.translate('general.daysAgo', { days: numberOfDays });
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

  openEdit(): void {
    if (this.id) {
      const ref = this.bottomSheet.open(PhotoEditComponent, {
        data: {
          id: this.id,
        },
      });

      ref.afterDismissed().subscribe((photo: Photo) => {
        if (photo) {
          this.mt.setName(this.getDateTitle(photo.takenAt));
        }
      });
    }
  }

  updateCoverPhoto(setCover: boolean): void {
    const photo = this.photoService.photo$.getValue();

    if (photo) {
      if (!setCover && photo.id === this.plantCoverId) {
        const plant: Plant = { id: photo.plantId } as Plant;
        this.plantService.update(plant, { removeCover: true }).subscribe(() => {
          this.plantCoverId = undefined;
        });
      } else if (setCover) {
        const plant: Plant = { id: photo.plantId, coverId: photo.id } as Plant;
        this.plantService.update(plant).subscribe(() => {
          this.plantCoverId = photo.id;
        });
      }
    }
  }
}
