import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { Location } from '@models/location.model';
import { ImagePath } from '@models/image-path.model';
import { FabComponent } from '@components/fab/fab.component';
import { LocationService } from '@services/location.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { LocationEditComponent } from '@components/location/location-edit/location-edit.component';


@Component({
  selector: 'location-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    MatBottomSheetModule,
    TranslateModule,
    FabComponent,
    WaitDialogComponent
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent {
  @Input() userId?: number;
  @Input() owned: boolean = true;
  locations$ = new BehaviorSubject<Location[]>([]);

  constructor(
    private apiService: ApiService,
    private locationService: LocationService,
    private imagePath: ImagePathService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.getLocationList();
  }

  getLocationList() {
    const wd = this.openWaitDialog();

    const options = {
      plantCount: true,
      userId: this.userId ? this.userId : null
    }

    const obs = this.apiService.getLocationList(options).pipe(
      finalize(() => { wd.close(); })
    );

    obs.subscribe((res) => { this.locations$.next(res) })
  }

  openEdit(id: number): void {
    const bsRef = this.bottomSheet.open(LocationEditComponent, {
      data: { id }
    });

    bsRef.afterDismissed().subscribe((updatedLocation: Location) => {
      if (updatedLocation) {
        const list = this.locations$.getValue();
        const index = list.findIndex((loc) => loc.id === updatedLocation.id);
        updatedLocation._count = { plants: list[index]._count.plants };
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
        question: this.translate.instant('location.remove'),
        accept: () => this.delete(id)
      },
    });
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


  delete(id: number) {
    this.locationService.delete(id).subscribe({
      next: (res) => {
        if (res.msg === 'LOCATION_REMOVED') this.getLocationList();
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') {
          this.translate.get('location.invalid').subscribe((res: string) => {
            this.errorHandler.push(res);
          })
        }
      }
    });

  }
}
