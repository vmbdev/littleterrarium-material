import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { HammerModule } from "@angular/platform-browser";
// import * as Hammer from 'hammerjs';

import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ImagePathService } from '@services/image-path.service';
import { InfoBoxComponent } from "@components/info-box/info-box.component";
import { PropertyComponent } from "@components/property/property.component";
import { MainToolbarService } from '@services/main-toolbar.service';

@Component({
    selector: 'app-photo',
    standalone: true,
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss'],
    imports: [
      CommonModule,
      RouterModule,
      InfoBoxComponent,
      PropertyComponent,
      TranslateModule,
      // HammerModule
    ]
})
export class PhotoComponent {
  @ViewChild('photo') photoElement!: ElementRef;
  id?: number;
  confirmDelete: boolean = false;
  enablePhotoEditing: boolean = false;
  navigation: any;
  plantCoverId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public photoService: PhotoService,
    private plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    public imagePath: ImagePathService,
    private translate: TranslateService,
    private mt: MainToolbarService
  ) { }

  ngOnInit(): void {
    // Angular doesn't update a component when the route only changes its parameters, so...
    this.route.params.subscribe((param: Params) => {
      this.id = param['photoId'];
      this.loadPhoto();
    })
  }

  // ngAfterViewInit(): void {
  //   const hammer = new Hammer(this.photoElement.nativeElement);
  //   hammer.get('pinch').set({ enable: true });
  // }

  loadPhoto(): void {
    if (this.id) {
      this.photoService.get(this.id, { navigation: true, cover: true }).pipe(
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
        // dayjs.extend(LocalizedFormat);

        if (res.data.navigation) this.navigation = res.data.navigation;
        if (res.data.plantCoverId) this.plantCoverId = res.data.plantCoverId;

        // FIXME: format data properly
        this.mt.setName(res.data.photo.takenAt);
        this.mt.setMenu([
          
        ]);

        // this.breadcrumb.setNavigation(
        //   [{
        //     selector: 'photo',
        //     name: dayjs(this.photoService.photo$?.getValue()?.takenAt).format('LL'),
        //     link: ['/photo', this.id]
        //   }], { attachTo: 'plant' })
      });
    }
  }

}
