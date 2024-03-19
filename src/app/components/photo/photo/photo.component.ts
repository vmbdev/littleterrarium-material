import { ChangeDetectionStrategy, Component, DestroyRef, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { DateTime } from 'luxon';

import { InfoBoxComponent } from '@components/info-box/info-box/info-box.component';
import { PropertyComponent } from '@components/info-box/property/property.component';
import { ToggleOptionComponent } from '@components/toggle-option/toggle-option.component';
import { PhotoEditComponent } from '@components/photo/photo-edit/photo-edit.component';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { PhotoService } from '@services/photo/photo.service';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { ImagePathService } from '@services/image-path/image-path.service';
import { ViewerService } from '@services/viewer/viewer.service';
import { ShareService } from '@services/share/share.service';
import { NavigationData, Photo } from '@models/photo.model';
import { DaysAgoPipe } from '@pipes/days-ago/days-ago.pipe';

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
    DaysAgoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly photoService = inject(PhotoService);
  protected readonly imagePath = inject(ImagePathService);
  private readonly translate = inject(TranslocoService);
  private readonly mt = inject(MainToolbarService);
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly viewer = inject(ViewerService);
  private readonly share = inject(ShareService);
  private readonly destroyRef = inject(DestroyRef);

  private id?: number;
  private navigation?: NavigationData;
  protected $currentImageFull: WritableSignal<string | null> = signal(null);
  protected photo$?: Observable<Photo | null>;

  ngOnInit() {
    this.setMtMenus();
    this.photo$ = this.getCurrentPhoto();
  }

  ngOnDestroy() {
    // in case a viewer is opened and we navigate out
    this.viewer.destroy();
  }

  getCurrentPhoto(): Observable<Photo | null> {
    // Angular doesn't update a component when the route only changes its
    // parameters, so we need to do it when navigating the previous/next photo
    return this.route.params.pipe(
      switchMap((param: Params) => {
        this.id = +param['photoId'];

        // in case a viewer is opened when we navigate
        this.viewer.destroy();

        return forkJoin([
          this.photoService.getNavigation(this.id),
          this.photoService.get(this.id),
        ]);
      }),
      tap(([navigation, photo]) => {
        this.$currentImageFull.set(this.imagePath.get(photo.images, 'full'));
        this.navigation = navigation;
        this.mt.setName(this.getDateTitle(photo.takenAt));
      }),
      switchMap(() => this.photoService.photo$),
    );
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

  loadNextPhoto() {
    if (this.navigation?.next) {
      this.router.navigate(['/photo', this.navigation.next.id], {
        replaceUrl: true,
      });
    }
  }

  loadPrevPhoto() {
    if (this.navigation?.prev) {
      this.router.navigate(['/photo', this.navigation.prev.id], {
        replaceUrl: true,
      });
    }
  }

  sharePhoto() {
    const img = this.$currentImageFull();

    if (img) {
      this.share.shareImageFromURL(img)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
    }
  }

  toggleViewer() {
    const img = this.$currentImageFull();

    if (img) this.viewer.create(img);
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
    const photo = this.photoService.current();

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
}
