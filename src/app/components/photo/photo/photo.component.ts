import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';


// import { HammerModule } from "@angular/platform-browser";
// import * as Hammer from 'hammerjs';

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

@Component({
    selector: 'photo',
    standalone: true,
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        InfoBoxComponent,
        PropertyComponent,
        TranslateModule,
        ToggleOptionComponent,
        MatDialogModule,
        // HammerModule
        DaysAgoPipe
    ]
})
export class PhotoComponent {
  @ViewChild('photo') photoElement!: ElementRef;
  id?: number;
  confirmDelete: boolean = false;
  enablePhotoEditing: boolean = false;
  navigation: any;
  plantCoverId?: number;
  coverChecked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public photoService: PhotoService,
    private plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    public imagePath: ImagePathService,
    private translate: TranslateService,
    private mt: MainToolbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Angular doesn't update a component when the route only changes its parameters, so...
    this.route.params.subscribe((param: Params) => {
      this.id = param['photoId'];
      this.loadPhoto();
    })
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

  // ngAfterViewInit(): void {
  //   const hammer = new Hammer(this.photoElement.nativeElement);
  //   hammer.get('pinch').set({ enable: true });
  // }

  loadPhoto(): void {
    if (this.id) {
      const wd = this.openWaitDialog();

      this.photoService.get(this.id, { navigation: true, cover: true }).pipe(
        finalize(() => { wd.close() }),
        catchError((err: HttpErrorResponse) => {
          let msg: string;

          if (err.error?.msg === 'PHOTO_NOT_FOUND') msg = 'photo.invalid';
          else msg = 'errors.server';

          this.translate.get(msg).subscribe((res: string) => {
            this.errorHandler.push(res);
          });
          
          this.router.navigateByUrl('/');
  
          return EMPTY;
        })
      ).subscribe((res) => {
        if (res.data.navigation) this.navigation = res.data.navigation;
        if (res.data.plantCoverId) this.plantCoverId = res.data.plantCoverId;

        const dateDiff = DateTime.fromISO(res.data.photo.takenAt).diffNow('days').days;
        const numberOfDays = Math.abs(Math.ceil(dateDiff)).toString();

        this.mt.setName(this.translate.instant('general.daysAgo', { days: numberOfDays }));
        this.mt.setMenu([]);
      });
    }
  }

  updateCoverPhoto(setCover: boolean): void {
    const photo = this.photoService.photo$.getValue();
    
    if (photo) {
      if (!setCover && (photo.id === this.plantCoverId)) {
        let plant: Plant = { id: photo.plantId } as Plant;
        this.plantService.update(plant, { removeCover: true }).subscribe(() => {
          this.plantCoverId = undefined;
        });
      }
      else if (setCover) {
        let plant: Plant = { id: photo.plantId, coverId: photo.id } as Plant;
        this.plantService.update(plant).subscribe(() => {
          this.plantCoverId = photo.id;
        });
      }
    }
  }

}
