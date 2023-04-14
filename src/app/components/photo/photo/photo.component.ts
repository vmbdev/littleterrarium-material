import { HammerModule } from '@angular/platform-browser';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize, fromEvent, startWith, switchMap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ImagePathService } from '@services/image-path.service';
import { InfoBoxComponent } from "@components/info-box/info-box.component";
import { PropertyComponent } from "@components/property/property.component";
import { MainToolbarService } from '@services/main-toolbar.service';
import { ToggleOptionComponent } from '@components/toggle-option/toggle-option.component';
import { Plant } from '@models/plant.model';
import { DaysAgoPipe } from "@pipes/days-ago/days-ago.pipe";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { LTHammerConfig } from 'src/config.hammerjs';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PhotoEditComponent } from '../photo-edit/photo-edit.component';
import { Photo } from '@models/photo.model';
import { BackendResponse } from '@models/backend-response.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'photo',
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
      TranslateModule,
      HammerModule,
      InfoBoxComponent,
      PropertyComponent,
      ToggleOptionComponent,
      DaysAgoPipe,
    ]
})
export class PhotoComponent {
  @ViewChildren('photo') photoElement!: QueryList<ElementRef>;
  id?: number;
  confirmDelete: boolean = false;
  enablePhotoEditing: boolean = false;
  navigation: any;
  plantCoverId?: number;
  coverChecked: boolean = false;
  touchEvents: any;
  queryListObs: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public photoService: PhotoService,
    private plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    public imagePath: ImagePathService,
    private translate: TranslateService,
    private mt: MainToolbarService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    // Angular doesn't update a component when the route only changes its parameters,
    // so we need to do it when navigating the previous/next photo
    this.route.params.subscribe((param: Params) => {
      this.id = param['photoId'];
      this.loadPhoto();
    })
  }

  ngAfterViewInit(): void {
    if (this.photoElement.first) {
      this.queryListObs = this.photoElement.changes.pipe(startWith(this.photoElement));
    }

    else this.queryListObs = this.photoElement.changes;

    this.queryListObs.pipe(
      switchMap((res: QueryList<ElementRef>) => {
        const hammerConfig = new LTHammerConfig();
        const hammer = hammerConfig.buildHammer(res.first.nativeElement);
          
        return fromEvent(hammer, 'swipe');
      })
    ).subscribe((res: any) => {
      let navigateTo: number | undefined;

      if (res.deltaX < 0) {
        if (this.navigation.prev?.id) navigateTo = this.navigation.prev.id;
      }
      else {
        if (this.navigation.next?.id) navigateTo = this.navigation.next.id;
      }
      
      if (this.id !== navigateTo) {
        this.id = navigateTo;
        this.loadPhoto();
      }
    })
  }

  loadPhoto(): void {
    if (this.id) {
      const wd = this.openWaitDialog();

      this.photoService.get(this.id, { navigation: true, cover: true }).pipe(
        finalize(() => { wd.close() }),
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          let msg: string;

          if (err.error?.msg === 'PHOTO_NOT_FOUND') msg = 'photo.invalid';
          else msg = 'errors.server';

          this.translate.get(msg).subscribe((res: string) => {
            this.errorHandler.push(res);
          });
          
          this.router.navigateByUrl('/');
  
          return EMPTY;
        }),
        switchMap((photo: Photo) => {
          this.mt.setName(this.getDateTitle(photo.takenAt));
          this.mt.setMenu([
            { icon: 'edit', tooltip: 'general.edit', click: () => { this.openEdit() } },
          ]);

          return this.photoService.getNavigation(photo.id);
        }),
        switchMap((navigation: any) => {
          this.navigation = navigation;
          const photo = this.photoService.photo$.getValue();

          if (photo?.plantId) return this.plantService.getCover(photo.plantId);
          else return EMPTY;
        })
      ).subscribe((cover: any) => {
        this.plantCoverId = cover.coverId;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.queryListObs) this.queryListObs.unsubscribe();
  }

  getDateTitle(date: string | Date): string {
    const d = date.toString();
    const dateDiff = DateTime.fromISO(d).diffNow('days').days;
    const numberOfDays = Math.abs(Math.ceil(dateDiff)).toString();

    return this.translate.instant('general.daysAgo', { days: numberOfDays });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('general.loading'),
        progressBar: false,
      },
    });
  }

  openEdit(): void {
    if (this.id) {
      const ref = this.bottomSheet.open(PhotoEditComponent, {
        data: {
          id: this.id,
        }
      });

      ref.afterDismissed().subscribe((photo: Photo) => {
        if (photo) this.mt.setName(this.getDateTitle(photo.takenAt));
      })
    }
  }

  updateCoverPhoto(setCover: boolean): void {
    const photo = this.photoService.photo$.getValue();
    
    if (photo) {
      if (!setCover && (photo.id === this.plantCoverId)) {
        const plant: Plant = { id: photo.plantId } as Plant;
        this.plantService.update(plant, { removeCover: true }).subscribe(() => {
          this.plantCoverId = undefined;
        });
      }
      else if (setCover) {
        const plant: Plant = { id: photo.plantId, coverId: photo.id } as Plant;
        this.plantService.update(plant).subscribe(() => {
          this.plantCoverId = photo.id;
        });
      }
    }
  }

}
